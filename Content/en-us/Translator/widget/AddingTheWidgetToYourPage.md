<!--
NavPath: Translator API/Web Widget
LinkLabel: Add Web Widget To Your Page
Weight: 115
url:translator-api/documentation/widget/AddingTheWidgetToYourPage
-->

##Adding the Widget to your Page##

The Translator Web Widget is available at [www.microsofttranslator.com/widget](http://www.bing.com/widget/translator). The code snippet can be copied and pasted to your website as is, or customized using the steps below. 

If you are using raw HTML files for your website, the Widget's code is contained within a <div>, so it can be placed anywhere within an HTML document that a <div> could normally be added. If you have any trouble with seeing the Widget, or if it looks wrong in any way, try pasting it outside of other elements, for example, after a closing </div> and before the next opening tag, or right after the <body> tag. The Widget position on your page will depend on where you place it in your HTML, so experiment with that if needed. 

If you are using a website platform such as Weebly, or blog services such as Tumblr or Blogger you can add the Widget as a custom HTML element. WordPress.org users can also use the free WordPress plugin available here. The Widget is currently not supported for Wordpress.com sites. More information on the Widget can be found at [www.microsoft.com/translator/widget.aspx](https://www.microsoft.com/en-us/translator/widget.aspx). 

##Customize the Widget##
The Widget can be customized quickly and easily on [www.microsofttranslator.com/widget](http://www.bing.com/widget/translator) to best fit your website and your visitors. The customization features are found directly below the box with the code snippet. When you are done selecting your preferences, copy the code and place it in your HTML. 

**Translation Settings:**

 * **Website Language:** Select the **original language** of the website. 
 * **When to Translate:** This setting controls when the Widget will start translating your website. **Manual** means that the user needs to click on the Translate button, and afterwards the translation will begin. **Auto** means that the translation will begin once the page loads. You can change these settings at any time by changing the "settings" parameter in the snippet to Auto or Manual. Read more about customizing the Widget parameters here. 
 
**Pick a Color:**

Customize the Translator button for use on websites with a light or dark background. 

The color of the Widget can be further customized by customizing the parameters in the code. The font color can be changed through the "color" parameter while the background color can be changed through the "background-color" parameter. Read more about customizing the parameters here. 


##Advanced Customization of the Translator Widget 
Advanced customization such as showing only specific languages on the language list, adjusting the color of the Widget, and changing when the Widget starts translating can be done through the use of custom parameters. See the full list of parameters [here](https://www.microsoft.com/cognitive-services/en-us/translator-api/documentation/widget/CusomizingTheWebWidget).

##Translator Widget API 
The Translator Widget API allows you to programmatically control aspects of the Widget and listen on its events. If you have some coding experience, you will be able to use the API to create your own "Translate" button and use it to invoke the Widget. You may also decide to trigger an event when the page translation is complete. See the API reference [here](https://www.microsoft.com/cognitive-services/en-us/translator-api/documentation/widget/TheTranslatorWebWidgetAPI).
