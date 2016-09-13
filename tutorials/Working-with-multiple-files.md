# Working with multiple files

Okay, in paper, `pagemanager` sounds good. But in practice, no one is gonna write every page of the app into a single .html file. That file would surely surpass the 1000 lines of code, and developing that would become a mess. That's why you should work with multiple files.

[mediocre-webapp-tools/barebones-template](https://github.com/mediocre-webapp-tools/barebones-template) already does that, so if you want, go ahead and check it out. If you'd rather not use that template (probably the right decision), this tutorial details how to do it with [gulp](http://gulpjs.com/). You can go ahead and add gulp to your project:

```
npm install --save-dev gulp
```

You will also need the [gulp-tap](https://www.npmjs.com/package/gulp-tap) plugin, so go ahead and install that:

```
npm install --save-dev gulp-tap
```

### Our project structure

Our project will have the following structure:

* index.html
* /pages
	* main.html
	* more.html
	* pages.html
* gulpfile.js

Our index.html will be a regular html file that contains the `<pages />` tag:

```html
<!DOCTYPE html>
<html>
<head>
	<title>My app!</title>
	<!-- more tags -->
</head>
<body>
	<!-- a navbar that stays there even if you change the current page -->
	<!-- a sidebar that stays there even if you change the current page -->
	<!-- whatever you come up with -->

	<pages />
</body>
</html>
```

Files inside the `/pages` folder will be (you guessed it) our pages:

```html
<!-- main.html -->
<p>This is the main page</p>

<!-- more.html -->
<p>This is another page</p>

<!-- pages.html -->
<p>This is yet another page</p>
```

Our goal is to have a built `index.html` that looks like this:

```html
<!DOCTYPE html>
<html>
<head>
	<title>My app!</title>
	<!-- more tags -->
</head>
<body>
	<!-- a navbar that stays there even if you change the current page -->
	<!-- a sidebar that stays there even if you change the current page -->
	<!-- whatever you come up with -->

	<div data-page="main" style="display: none;">
		<p>This is the main page</p>
	</div>
	
	<div data-page="more" style="display: none;">
		<p>This is another page</p>
	</div>
	
	<div data-page="pages" style="display: none;">
		<p>This is yet another page</p>
	</div>
</body>
</html>
```

To achieve that, we will give build instructions to `gulp` on our `gulpfile.js`.

### Building our app

Create a `gulpfile.js` and add the following dependencies:

```javascript
const fs   = require('fs'),
      gulp = require('gulp'),
      tap  = require('gulp-tap');
```

* `gulp`is the library that we will use to build our app.
* `gulp-tap` is a `gulp` plugin that allows us to manually modify a file.
* `fs` is node's filesystem, that allows us to read files from our system.

Now add the following constants containing the structure of our project. Feel free to modify them to your convenience:

```javascript
const HTML_MAIN      = './index.html',
      HTML_PAGES     = './pages',
      HTML_DEST      = './build', // Can't be './' or else it'd
                                  // overwrite 'index.html'
      HTML_PAGES_TAG = '<pages />';
```

Now we need to create a gulp task. If you're not familiar with gulp, each gulpfile contains different tasks that can depend on each other. Each task should achieve a single goal. Since that's what we're doing here, we'll put all our code under the `default` task:

```javascript
gulp.task('default', function(){
	// Our code goes here
});
```

When we run `gulp` from the command line, the code from that task gets executed. What we need to do now is load the `index.html` file into the gulp task.

```javascript
gulp.task('default', function(){
	return gulp.src(HTML_MAIN)              // Load index.html
	           .pipe(gulp.dest(HTML_DEST)); // Save it to ./build/index.html
});
```

That was easy. Go ahead and type `gulp` in your command line to see if everything went right. You should find a copy of your `index.html` in the `/build` folder.

The task merely does that though. What we need now is to replace the `<pages />` tag with the pages themselves. For that, we'll define a custom function below the gulp task:

```javascript
function getHtmlPages() {
	var regex = /(.+)\.html/; // Matches every html file
	var pages = '';

	// Get the pages list
	var filenames = fs.readdirSync(HTML_PAGES);

	// Filter out every element that doesn't match the regex
	// So, every non-html file
	filenames = filenames.filter(val => {
		return val.match(regex) !== null;
	});

	// Add each file to the pages string,
	// wrapped around a div containing the page's name
	for (var i = 0; i < filenames.length; i++) {
		pages += '<div data-page="' + filenames[i].match(regex)[1] + '" ' +
		              'style="display: none;">';
		pages += fs.readFileSync(HTML_PAGES + '/' + filenames[i], 'utf-8');
		pages += '</div>';
	}

	return pages;
}
```

Basicly, this function returns a string with the content of every single html page. It wraps it arounds a div with `data-page="page_name"` and `style="display: none;"`, the two requirements that a page needs to meet for `pagemanager` to work porperly.

Now, the last thing we need is replacing `<pages />` with that string. We can do that with the help of  `gulp-tap`. Let's get back to our gulp task:

```javascript
gulp.task('default', function(){
	return gulp.src(HTML_MAIN)
	           .pipe(tap(function(file, t){
		           file.contents = new Buffer(
			           file.contents
			               .toString('utf-8')
			               .replace(
				               HTML_PAGES_TAG,
				               getHtmlPages()
			               ),
			           'utf-8'
		           );
	           }))
	           .pipe(gulp.dest(HTML_DEST));
});
```

Okay, lots of stuff going on there. Let's break it down:

* First, `tap(file, t)` provides us with a file. We don't care about the `t`. And we only care about `file.contents`, wich is a [Buffer](https://nodejs.org/api/buffer.html) that contains our `index.html`.
* Because it's a Buffer, we need to set `file.contents` to a buffer, not a string. The way to do that is:

  ```javascript
  file.contents = new Buffer(string, encoding);
  
  // For instance:
  file.contents = new Buffer('<p>This is the new file!</p>', 'utf-8');
  // our './build/index.html' would only contain that string.
  ```
* The string we need to pass to the `new Buffer()` is our final html. So first we need to get the current html from `index.html`:
```javascript
file.contents.toString('utf-8')
```
* Finally, we need to replace `<pages />` with the result of `getHtmlPages()`
```javascript
.replace(HTML_PAGES_TAG, getHtmlPages())
```

And that's it. Our gulp task is done. Try it by running
```
gulp
```

Check your `./build/index.html`. It should be that horrendous html file containing evey page that we were previously talking about. Except for the fact that you don't have to work with it! You just have to distribute it, and forget about it.

We're almost done. But remember, you have to actually use `pagemanager`! Otherwise, no page will be shown in your final html.

Include a quick script in your app:

```javascript
const PageManager = require('pagemanager'),
      $           = require('jquery'); // Pagemanager depends on jQuery, so you
                                       // might as well use it too.

$(document).ready(() => {
	var pm = new PageManager('main');
});
```

And you're done!

How do you include the script in your app is up to you, though. Now that you have experience with gulp, check out [Browserify](http://browserify.org/) and the [gulp-browserify](https://www.npmjs.com/package/gulp-browserify) plugin. Or follow the instructions in [Converting from CommonJS to browser script]{@tutorial Converting-to-browser-script} otherwise.

Good luck!