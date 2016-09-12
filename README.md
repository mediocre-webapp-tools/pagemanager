# pagemanager.js

`pagemanager.js` is a simple module that lets you manage HTML "pages" by keeping the active page shown and every other page hidden.

### So, what is a "page"?

A "page" would be something as simple as the following:

```html
<div data-page="my_page" style="display: none;">
	<h1>Hello! Welcome to My Page</h1>
	<p>Some text here</p>
</div>
```

Every page should be hidden by default, `pagemanager` takes care of the visibility. If `MY_PAGE` is your default page, you can show it when you first create an instance of PageManager:

```javascript
var pm = new PageManager('my_page');
```

If you have other pages, you can show them whenever you want:

```javascript
document.getElementById('settings_page_button').onclick = () => {
	pm.show('settings');
};
```

You can also load a page from an HTML string whenever you want. You could use this to load remote pages:

```javascript
var request = new XMLHttpRequest();
request.open('GET', 'http://foo.bar', true);

request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    pm.load('my_loaded_page', this.response);
    pm.show('my_loaded_page');
  }
};

request.send();
```

### Where to go from here?

* [Documentation](https://mediocre-webapp-tools.github.io/pagemanager/1.0.0/)
* [Use this in the browser without a CommonJS build system](https://mediocre-webapp-tools.github.io/pagemanager/1.0.0/tutorial-Converting-to-browser-script.html).