'use strict';

var $ = require('jquery');

/**
 * A class that easily manages HTML pages.
 *
 * @class  PageManager
 * @param  {string} [defaultPage='main'] The default page's name, wich corresponds to the filename
 *                                       without the .html extension.
 * @param  {boolean} [showDefault=true] Immediatly display the default page after creating an
 *                                      instance of the class.
 *
 * @property {string} current The current's page name, wich corresponds to the filename without
 *                              the .html extension.
 * @property {string} defaultPage The default page's name.
 *
 * @example
 * var PageManager = require('pagemanager');
 *
 * var pm = new PageManager('landPage');
 * 
 * @author [Pablo Rodríguez]{@link https://github.com/MeLlamoPablo}
 */
class PageManager {

	constructor(defaultPage = 'main', showDefault = true) {
		this.defaultPage = defaultPage;

		if (showDefault) {
			this.show(defaultPage);
		}
	}

	/**
	 * Hides the current page and displays the requested one.
	 * @param  {string} page The requested page's name, wich corresponds to the filename without the
	 *                       .html extension.
	 *
	 * @example
	 * pm.show('sendMessage');	
	 */
	show(page) {
		var element = $('[data-page="' + page + '"]');

		if (element.length === 0) {
			throw new Error('Page ' + page + ' doesn\'t exist!');
		} else {
			if(typeof this.current !== 'undefined')
				$('[data-page="' + this.current + '"]').hide();

			element.show();
			this.current = page;
		}
	}

	/**
	 * Creates a new (hidden) page from an html string. You still need to call show() with the name
	 * you've given it to show it, because it's hidden by default.
	 *
	 * @param {string} name The new page's name.
	 * @param {string} html The new page's html content.
	 *
	 * @example
	 * pm.load('new_page', '<p>My content!</p>');
	 * pm.show('new_page');
	 */
	load(name, html) {
		if (typeof name === 'undefined')
			throw new Error('Parameter name is missing');
		if (typeof html === 'undefined')
			throw new Error('Parameter html is missing');

		var parent = $('[data-page="' + this.defaultPage + '"]')[0].parentElement;
		var loaded = $.parseHTML(
			'<div data-page="' + name + '" style="display: none;">' + html + '</div>'
		)[0];

		parent.appendChild(loaded);
	}
}

module.exports = PageManager;