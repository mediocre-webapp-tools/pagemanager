#Converting from CommonJS to browser script

`packagemanager.js` is a CommonJS module, and therefore you can't throw it to the browser without doing some tweaks.

### tl;dr: what's CommonJS?

It's this:

#### double.js

```javascript
module.exports = function(nomber){
	return numer * 2;
}
```

#### main.js

```javascript
var double = require('./double.js');
console.log(double(5)); // 10
```

### How do I use it in the browser?

The recommended way would be to use a CommonJS build system such as [Browserify](http://browserify.org/) or [Webpack](https://webpack.github.io/). However, if that's too much trouble, go ahead and do the following modifications to `pagemanager.js`:

* Remove the following lines:
```javascript
var $ = require('jquery');
```
```javascript
module.exports = PageManager;
```
* In your html file, include `pagemanajer.js` **after** jQuery:
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script type="text/javascript" src="pagemanager.js" ></script>
```

There you go, it should now work.