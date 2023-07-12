/*global QUnit*/

sap.ui.define([
	"comborderstates/topazsignature/controller/SignatureCapture.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SignatureCapture Controller");

	QUnit.test("I should test the SignatureCapture controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
