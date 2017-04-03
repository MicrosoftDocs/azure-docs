<!--
NavPath: Translator API/Web Widget
LinkLabel: Web Widget API
Weight: 105
url:translator-api/documentation/widget/TheTranslatorWebWidgetAPI
-->

##Web Widget Customization API##

The Web Widget Customization API enables you to customize the Translator Web Widget for your specific needs. You can programmatically call the Translator Web Widget’s functions and listen on its events. 
For example, you can create a custom “Translate” button that blends well with your site’s UI or even define a certain trigger for the Translator Web Widget. You may also want to define actions that occur after translation of your page is complete. 

**Endpoint**

<script src="http://www.microsoftTranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**" type="text/javascript"></script>

**Methods**

| Name                                                                                        | Description                                                                                                                                   |
|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Translate                                                                                   | Launches the Widget which translates the current page to the desired language. A callback function provides translation progress information. |
| RestoreOriginal                                                                             | Restores the original text in every HTML element that has been translated. It also stops the translation if in progress.                      |
| GetLanuagesForTranslate                                                                     | Returns a list of Language objects with localized names according to the locale parameter provided.                                           |
| GetLanguagesForTranslateLocalized                                                           | Returns a list of Language objects in which each language name is localized in its own locale. E.g. English, Deutsch, العربية,…               |
| GetAutoDetectedLanguage                                                                     | The Widget can auto-detect the language of the page – this method returns a string containing the last automatically-detected language.       |


##Translate Method##

This method launches the Widget which translates the current page to the desired language. A callback function provides you translation progress information. 

**Syntax**
**Javascript**

Microsoft.Translator.Widget.Translate(from, to, onProgress:(value), onError: (error), onComplete:(), onRestoreOriginal:(toLanguage), timeOut);

**Parameters**

| Parameter   | Description                                                                                                                                       |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
|  from       | Optional. A string representing the language code of the original text. If set to null, the source language is autodetected from the page.        |
|  to         | Required. A string representing the language code to translate the text into.                                                                     |
|  onProgress | Optional. A function delegate that receives an integer value from 0-100 indicating how much of the page is translated.                            |
|  onError    | Optional. A function delegate that receives a string that describes an error upon occurrence.                                                     |
|  onComplete | Optional. A function delegate that is called when the page translation is complete, similar to calling onProgress(100)                            |
|  timeOut    | Optional. A number in milliseconds to abort the function after if the translation is not complete, consider using large values with larger pages. |

**Returns**

void

>Note: You may exclude specific site content from translation by the widget through the use of the custom attribute translate=no or class=notranslate. Any element with either of these attributes set will be excluded from the widgets translation and will therefore remain in its original language. This feature is also demonstrated in the example code.

**Example**
**HTML**
```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Microsoft Widget API Sample</title>
    <script src="http://www.microsoftTranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**" type="text/javascript"></script>
    <script type="text/javascript">
        
        document.onreadystatechange = function () {
            if (document.readyState == 'complete') {
                Microsoft.Translator.Widget.Translate('en', 'es', onProgress, onError, onComplete, onRestoreOriginal, 2000);
            }
        }
        //You can use Microsoft.Translator.Widget.GetLanguagesForTranslate to map the language code with the language name
        function onProgress(value) {
            document.getElementById('counter').innerHTML = Math.round(value);
        }

        function onError(error) {
            alert("Translation Error: " + error);
        }

        function onComplete() {
            document.getElementById('counter').style.color = 'green';
        }
        //fires when the user clicks on the exit box of the floating widget
        function onRestoreOriginal() { 
            alert("The page was reverted to the original language. This message is not part of the widget.");
        }

    </script>
</head>
<body>

<!-- The attribute: translate="no" tells the widget not to translate this block of text -->
    <div style="text-align: right" translate="no">
        <span>Translation Progress </span><span id="counter" style="color: red">0</span><span>%</span>
        <div>
            The page will display an error message box if the widget takes more than two seconds to finish
            translation.
        </div>
    </div>
    </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
    <div style="text-align: center" >
        The widget will translate this text. The widget will translate this text. The widget will translate this text. 
    </div>
</body>
</html>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Microsoft Widget API Sample</title>
    <script src="http://www.microsoftTranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**" type="text/javascript"></script>
    <script type="text/javascript">
        
        document.onreadystatechange = function () {
            if (document.readyState == 'complete') {
                Microsoft.Translator.Widget.Translate('en', 'es', onProgress, onError, onComplete, onRestoreOriginal, 2000);
            }
        }
        //You can use Microsoft.Translator.Widget.GetLanguagesForTranslate to map the language code with the language name
        function onProgress(value) {
            document.getElementById('counter').innerHTML = Math.round(value);
        }

        function onError(error) {
            alert("Translation Error: " + error);
        }

        function onComplete() {
            document.getElementById('counter').style.color = 'green';
        }
        //fires when the user clicks on the exit box of the floating widget
        function onRestoreOriginal() { 
            alert("The page was reverted to the original language. This message is not part of the widget.");
        }

    </script>
</head>
<body>

<!-- The attribute: translate="no" tells the widget not to translate this block of text -->
    <div style="text-align: right" translate="no">
        <span>Translation Progress </span><span id="counter" style="color: red">0</span><span>%</span>
        <div>
            The page will display an error message box if the widget takes more than two seconds to finish
            translation.
        </div>
    </div>
    </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
    <div style="text-align: center" >
        The widget will translate this text. The widget will translate this text. The widget will translate this text. 
    </div>
</body>
</html>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Microsoft Widget API Sample</title>
    <script src="http://www.microsoftTranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**" type="text/javascript"></script>
    <script type="text/javascript">
        
        document.onreadystatechange = function () {
            if (document.readyState == 'complete') {
                Microsoft.Translator.Widget.Translate('en', 'es', onProgress, onError, onComplete, onRestoreOriginal, 2000);
            }
        }
        //You can use Microsoft.Translator.Widget.GetLanguagesForTranslate to map the language code with the language name
        function onProgress(value) {
            document.getElementById('counter').innerHTML = Math.round(value);
        }

        function onError(error) {
            alert("Translation Error: " + error);
        }

        function onComplete() {
            document.getElementById('counter').style.color = 'green';
        }
        //fires when the user clicks on the exit box of the floating widget
        function onRestoreOriginal() { 
            alert("The page was reverted to the original language. This message is not part of the widget.");
        }

    </script>
</head>
<body>

<!-- The attribute: translate="no" tells the widget not to translate this block of text -->
    <div style="text-align: right" translate="no">
        <span>Translation Progress </span><span id="counter" style="color: red">0</span><span>%</span>
        <div>
            The page will display an error message box if the widget takes more than two seconds to finish
            translation.
        </div>
    </div>
    </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
    <div style="text-align: center" >
        The widget will translate this text. The widget will translate this text. The widget will translate this text. 
    </div>
</body>
</html>
```


##RestoreOriginal Method##

Restores the original text in every HTML element that has been translated. It also stops the translation if in progress. 

**Syntax**
**Javascript**

Microsoft.Translator.Widget.RestoreOriginal();

**Parameters**

none

**Returns**

void

**Example**
**HTML**
```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Microsoft Widget API Sample</title>
    <script src="http://microsofttranslator.com/ajax/v3/widgetv3.ashx" type="text/javascript"></script>
    <script type="text/javascript">
        document.onreadystatechange = function () {
            if (document.readyState == 'complete') {
                Microsoft.Translator.Widget.Translate(null, 'zh-chs', null, null, function () {
                    alert('Translate Complete, now restoring original ');
                    Microsoft.Translator.Widget.RestoreOriginal();
                });
            }
        }
        //You can use Microsoft.Translator.Widget.GetLanguagesForTranslate to map the language code with the language name
    </script>
</head>
<body>
    <div>
        This is a text block for testing.
    </div>
</body>
</html>
```


##GetLanguagesForTranslate Method##

Returns a list of Language objects with localized names according to the locale parameter provided. 

###**Syntax**###

####**Javascript**####

Microsoft.Translator.Widget.GetLanguagesForTranslate(locale, onComplete(languages),onError:(error), timeOut);
						
###**Parameters**###

| Parameter  | Type     | Description                                                                                                                        |
|------------|----------|------------------------------------------------------------------------------------------------------------------------------------|
| locale     | string   | Required. Language code of the localization language. Must be a valid culture name.                                                |
| onComplete | function | Required. A function delegate that is fired upon completion, receiving ILanguage[] of all the supported languages for translation. |
| onError    | function | Optional. A function delegate that receives a string that describes an error upon occurrence.                                      |
| timeOut    | number   | Optional. A number in milliseconds to abort the function after if the value is not returned.                                       |

###**Returns**###

void. The language list is returned in the OnComplete function as an **array of ILanguage** object instances. The ILanguage object contains the following propoerties:

| Property | Type   | Description                                               |
|----------|--------|-----------------------------------------------------------|
| Code     | string | Culture name for the language.                            |
| Name     | string | Friendly name for the language - in the locale specified. |

###**Example**###
##**HTML**##
```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Microsoft Widget API Sample</title>
    <script src="http://microsofttranslator.com/ajax/v3/widgetv3.ashx" type="text/javascript"></script>
    <script type="text/javascript">
        document.onreadystatechange = function () {
            if (document.readyState == 'complete') {
                Microsoft.Translator.Widget.GetLanguagesForTranslate('en',
                    function (supportedLanguages) {
                        //the input parameter of the callback is an array of a custom object that holds two properties, Name and Code
                        fillList(supportedLanguages, 'langs');
                    },
                    function (error) {
                        alert(error);
                    }
                );
                //Filling the second select with the list of languages localized in Arabic
                Microsoft.Translator.Widget.GetLanguagesForTranslate('ar',
                    function (supportedLanguages) {
                        fillList(supportedLanguages, 'langsArabic');
                    },
                    function (error) {
                        alert(error);
                    }
                );

                //Filling a table with the list of languages localized in Japanese
                Microsoft.Translator.Widget.GetLanguagesForTranslate('ja',
                    function (supportedLanguages) {
                        fillTable(supportedLanguages);
                    },
                    function (error) {
                        alert(error);
                    }
                );
            }
        }
        function fillList(listOfLanguages, listId) {
            var ddlLangs = document.getElementById(listId);
            for (var key in listOfLanguages) {
                var optLang = document.createElement('option');
                //Language name is in .Name property
                optLang.innerHTML = listOfLanguages[key].Name;
                //Langauge code is .Code property
                optLang.value = listOfLanguages[key].Code;
                ddlLangs.appendChild(optLang);
            }
        }

        function fillTable(listOfLanguages) {
            var tbl = document.getElementById('tbleLangs').children[0];

            for (var key in listOfLanguages) {
                var row = document.createElement('tr');
                var c1 = document.createElement('td');
                c1.innerHTML = listOfLanguages[key].Code;
                var c2 = document.createElement('td');
                c2.innerHTML = listOfLanguages[key].Name;
                row.appendChild(c1);
                row.appendChild(c2);
                tbl.appendChild(row);
            }
        }
    </script>
    <style type="text/css">
        div
        {
            margin: 7px;
        }
        table, th, td
        {
            border: 1px solid;
            border-collapse: collapse;
            min-width: 100px;
            padding: 3px;
        }
    </style>
</head>
<body>
    <div>
        <span>List of supported languages: </span>
        <select id="langs">
        </select>
    </div>
    <div>
        <span>List of supported languages in Arabic: </span>
        <select id="langsArabic" style="direction: rtl">
        </select>
    </div>
    <div>
        <span>Table of languages' codes and names localized in Japanese</span>
        <table id="tbleLangs">
            <tbody>
                <tr>
                    <th>
                        Code
                    </th>
                    <th>
                        Name
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
```



##GetLanguagesForTranslateLocalized Method##

Returns a list of Language objects in which each language name is localized in its own locale. E.g. English, Deutsch,العربية ,… 

**Syntax**
**Javascript**

Microsoft.Translator.Widget.GetLanguagesForTranslateLocalized();

**Parameters**

none

**Returns**

An array of ILanguage object instances. The ILanguage object contains the following propoerties: 

| Property  | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| Code      | string | Culture name for the language.                           |
| Name      | string | Friendly name for the language - in the locale specified |

> **Note**: This method is not an asynchronous method, unlike others, it returns the list of languages immediately.

**Example**
**HTML**
```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Microsoft Widget API Sample</title>
        <script src="http://microsofttranslator.com/ajax/v3/widgetv3.ashx" type="text/javascript"></script>
        <script type="text/javascript">
        
        //This script should wait for the API's library to load and for the page to complete to be able to change DOM elements
                    document.onreadystatechange = function() {
                if (document.readyState == 'complete') {
                    fillTable(Microsoft.Translator.Widget.GetLanguagesForTranslateLocalized());
                    fillList(Microsoft.Translator.Widget.GetLanguagesForTranslateLocalized());
                }
            };

            function fillList(listOfLanguages) 
            {
                var ddlLangs = document.getElementById('langs');
                for (var key in listOfLanguages) 
                {
                    var optLang = document.createElement('option');
                    //Language name is in .Name property
                    optLang.innerHTML = listOfLanguages[key].Name;
                    //Langauge code is .Code property
                    optLang.value = listOfLanguages[key].Code;
                    ddlLangs.appendChild(optLang);
                }
            }

            function fillTable(listOfLanguages)
            {
                var tbl = document.getElementById('tbleLangs').children[0];

                for (var key in listOfLanguages) 
                {
                    var row = document.createElement('tr');
                    var c1 = document.createElement('td');
                     c1.innerHTML =  listOfLanguages[key].Code;
                    var c2 = document.createElement('td');
                    c2.innerHTML = listOfLanguages[key].Name;
                    row.appendChild(c1);
                    row.appendChild(c2);
                    tbl.appendChild(row);
                }
            }
            
         
        </script>
        <style type="text/css">
            div { margin: 7px; }
            table, th, td 
            {
                border: 1px solid;
                border-collapse: collapse;
                min-width: 100px;
                padding: 3px;
            }
        </style>
    </head>
    <body>
        <div>
            <span>List of languages: </span>
            <select id="langs">
            </select>
        </div>
       
        <div>
            <span>Table of codes and localized names</span>
            <table id="tbleLangs">
                <tbody>
                <tr>
                    <th>
                        Code
                    </th>
                    <th>
                        Localized Name 
                    </th>
                </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>
```				


	

##GetAutoDetectedLanguage Method##

The Widget can auto-detect the language of the page – this method returns a string containing the last automatically-detected language. 

**Syntax**
**Javascript**

Microsoft.Translator.Widget.GetAutoDetectedLanguage();

**Parameters**

none

**Returns**

A string containing the last Auto-detected Language Code. This method needs to be called after at least one Translate call has been issued with 'from' input parameter set to null or empty string. Otherwise, returns null.

> Note: This method should be used after the first onProgress callback as the detected language will be be known only by then.

**Example**
**HTML**
```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Microsoft Widget API Sample</title>
    <script src="http://microsofttranslator.com/ajax/v3/widgetv3.ashx" type="text/javascript"></script>
    <script type="text/javascript" defer="defer">
        document.onreadystatechange = function () {
            if (document.readyState == 'complete') {
                Microsoft.Translator.Widget.Translate(null, 'en', null, null, function () {
                    alert('Detected Language Code: ' + Microsoft.Translator.Widget.GetAutoDetectedLanguage());
                });
            }
        }
        //You can use Microsoft.Translator.Widget.GetLanguagesForTranslate to map the language code with the language name
    </script>
</head>
<body>
    <div>
        Este es el texto de los bloques de prueba.
    </div>
</body>
</html>
```
