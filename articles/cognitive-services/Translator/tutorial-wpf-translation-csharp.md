---
title: Microsoft Translator Text API Tutorial (C#) | Microsoft Docs
description: Learn how to use the Translator text service to translate text, get a localized list of supported languages, and more.
services: cognitive-services
author: Jann-Skotdal
manager: chriswendt1

ms.service: cognitive-services
ms.technology: translator
ms.devlang: csharp
ms.topic: article
ms.date: 10/25/2017
ms.author: v-jansko
---
# Tutorial: Microsoft Translator WPF application in C#

In this tutorial, we'll build an interactive text translation tool using the Microsoft Translator text translation service, a part of Microsoft Cognitive Services in Azure. You'll learn how to:

> [!div class="checklist"]
> * Request a list of short codes for the languages supported by the service
> * Retrieve a list of localized language names corresponding to these language codes
> * Obtain the translated version of user-entered text from one language to another

This application also features integration with two other Microsoft Cognitive Services.

|||
|-|-|
|[Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/)|Used to optionally automatically detect the source language of the text to be translated|
|[Bing Spell Check](https://azure.microsoft.com/services/cognitive-services/spell-check/)|For English source text, used to correct misspellings so translation is more accurate

![[The tutorial program running]](media/translator-text-csharp-session.png)

## Prerequisites

To do this tutorial, you need any edition of Visual Studio 2017, including the Community Edition.

You also need subscription keys for the three Azure services used in the program. You can get a key for the Translator Text service from the Azure dashboard. A free pricing tier is available that allows you to translate up to two million characters per month at no charge.

Both the Text Analytics and Bing Spell Check services offer free trials, which you can sign up for on [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/). You may also create a subscription for either service via the Azure dashboard. Text Analytics has a free tier.

Source code for this tutorial is available below. Your subscription keys must be copied into the source code as the variables `TEXT_TRANSLATION_API_SUBSCRIPTION_KEY`, and so on, in `MainWindow.xaml.cs`.

> [!IMPORTANT]
> The Text Analytics service is available in multiple regions. The URI in our tutorial source code is in the `westus` region, which is the region used for free trials. If you have a subscription in another region, update this URI accordingly.

## Source code

This is the source code for the Microsoft Translator text API. To run the app, copy the source code into the appropriate file in a new WPF project in Visual Studio.

### MainWindow.xaml.cs

This is the code-behind file that provides the application's functionality.

```cs
using System;
using System.Windows;
using System.Net;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MSTranslatorTextDemo
{

    /// <summary>
    /// This WPF application demonstrates the use of the Microsoft Translator Text API to translate a brief text string
    /// one language to another. The langauges are selected from a drop-down menu. The text of the translation is displayed.
    /// The source language may optionally be automatically detected.  English text is spell-checked.
    /// </summary>
    public partial class MainWindow : Window
    {
        // Translator text subscription key from Microsoft Azure dashboard
        const string TEXT_TRANSLATION_API_SUBSCRIPTION_KEY = "YOUR_KEY_GOES_HERE";
        const string TEXT_ANALYTICS_API_SUBSCRIPTION_KEY   = "YOUR_KEY_GOES_HERE";
        const string BING_SPELL_CHECK_API_SUBSCRIPTION_KEY = "YOUR_KEY_GOES_HERE";

        const string TEXT_TRANSLATION_API_ENDPOINT = "https://api.microsofttranslator.com/v2/Http.svc/";
        const string TEXT_ANALYTICS_API_ENDPOINT   = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/";
        const string BING_SPELL_CHECK_API_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/";

        private string[] languageCodes;     // array of language codes

        // Dictionary to map language code from friendly name (sorted case-insensitively on language name)
        private SortedDictionary<string, string> languageCodesAndTitles = 
            new SortedDictionary<string, string>(Comparer<string>.Create((a, b) => string.Compare(a, b, true)));

        public MainWindow()
        {
            // at least show an error dialog when we get an unexpected error
            AppDomain.CurrentDomain.UnhandledException += new UnhandledExceptionEventHandler(HandleExceptions);

            if (TEXT_TRANSLATION_API_SUBSCRIPTION_KEY.Length != 32 
                || TEXT_ANALYTICS_API_SUBSCRIPTION_KEY.Length != 32 
                || BING_SPELL_CHECK_API_SUBSCRIPTION_KEY.Length != 32)
            {
                MessageBox.Show("One or more invalid API subscription keys.\n\n" +
                    "Put your keys in the *_API_SUBSCRIPTION_KEY variables in MainWindow.xaml.cs.", 
                    "Invalid Subscription Key(s)", MessageBoxButton.OK, MessageBoxImage.Error);
                System.Windows.Application.Current.Shutdown();
            }
            else
            {
                InitializeComponent();          // start the GUI
                GetLanguagesForTranslate();     // get codes of languages that can be translated
                GetLanguageNames();             // get friendly names of languages
                PopulateLanguageMenus();        // fill the drop-down language lists
            }
        }

        // Global exception handler to display error message and exit
        private static void HandleExceptions(object sender, UnhandledExceptionEventArgs args)
        {
            Exception e = (Exception)args.ExceptionObject;
            MessageBox.Show("Caught " + e.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            System.Windows.Application.Current.Shutdown();
        }

        // ***** POPULATE LANGUAGE MENUS
        private void PopulateLanguageMenus()
        {
            // Add option to automatically detect the source language
            FromLanguageComboBox.Items.Add("Detect");

            int count = languageCodesAndTitles.Count;
            foreach (string menuItem in languageCodesAndTitles.Keys)
            {
                FromLanguageComboBox.Items.Add(menuItem);
                ToLanguageComboBox.Items.Add(menuItem);
            }

            // set default languages
            FromLanguageComboBox.SelectedItem = "Detect";
            ToLanguageComboBox.SelectedItem = "English";
        }

        // ***** DETECT LANGUAGE OF TEXT TO BE TRANSLATED
        private string DetectLanguage(string text)
        {
            string uri = TEXT_ANALYTICS_API_ENDPOINT + "languages?numberOfLanguagesToDetect=1";

            // create request to Text Analytics API
            HttpWebRequest detectLanguageWebRequest = (HttpWebRequest)WebRequest.Create(uri);
            detectLanguageWebRequest.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_ANALYTICS_API_SUBSCRIPTION_KEY);
            detectLanguageWebRequest.Method = "POST";

            // create and send body of request
            var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string jsonText = serializer.Serialize(text);

            string body = "{ \"documents\": [ { \"id\": \"0\", \"text\": " + jsonText + "} ] }";
            byte[] data = Encoding.UTF8.GetBytes(body);
            detectLanguageWebRequest.ContentLength = data.Length;

            using (var requestStream = detectLanguageWebRequest.GetRequestStream())
                requestStream.Write(data, 0, data.Length);

            HttpWebResponse response = (HttpWebResponse)detectLanguageWebRequest.GetResponse();

            // read and and parse JSON response
            var responseStream = response.GetResponseStream();
            var jsonString = new StreamReader(responseStream, Encoding.GetEncoding("utf-8")).ReadToEnd();
            dynamic jsonResponse = serializer.DeserializeObject(jsonString);

            // fish out the detected language code
            var languageInfo = jsonResponse["documents"][0]["detectedLanguages"][0];
            if (languageInfo["score"] > (decimal)0.5)
                return languageInfo["iso6391Name"];
            else
                return "";
        }

        // ***** CORRECT SPELLING OF TEXT TO BE TRANSLATED
        private string CorrectSpelling(string text)
        {
            string uri = BING_SPELL_CHECK_API_ENDPOINT + "?mode=spell&mkt=en-US";

            // create request to Bing Spell Check API
            HttpWebRequest spellCheckWebRequest = (HttpWebRequest)WebRequest.Create(uri);
            spellCheckWebRequest.Headers.Add("Ocp-Apim-Subscription-Key", BING_SPELL_CHECK_API_SUBSCRIPTION_KEY);
            spellCheckWebRequest.Method = "POST";
            spellCheckWebRequest.ContentType = "application/x-www-form-urlencoded"; // doesn't work without this

            // create and send body of request
            string body = "text=" + System.Web.HttpUtility.UrlEncode(text);
            byte[] data = Encoding.UTF8.GetBytes(body);
            spellCheckWebRequest.ContentLength = data.Length;
            using (var requestStream = spellCheckWebRequest.GetRequestStream())
                requestStream.Write(data, 0, data.Length);
            HttpWebResponse response = (HttpWebResponse)spellCheckWebRequest.GetResponse();

            // read and parse JSON response and get spelling corrections
            var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            var responseStream = response.GetResponseStream();
            var jsonString = new StreamReader(responseStream, Encoding.GetEncoding("utf-8")).ReadToEnd();
            dynamic jsonResponse = serializer.DeserializeObject(jsonString);
            var flaggedTokens = jsonResponse["flaggedTokens"];

            // construct sorted dictionary of corrections in reverse order in string (right to left)
            // so that making a correction can't affect later indexes
            var corrections = new SortedDictionary<int, string[]>(Comparer<int>.Create((a, b) => b.CompareTo(a)));
            for (int i = 0; i < flaggedTokens.Length; i++) {
                var correction = flaggedTokens[i];
                var suggestion = correction["suggestions"][0];  // consider only first suggestion
                if (suggestion["score"] > (decimal)0.7)         // take it only if highly confident
                    corrections[(int)correction["offset"]] = new string[]   // dict key   = offset
                        { correction["token"], suggestion["suggestion"] };  // dict value = {error, correction}
            }

            // apply the corrections in order from right to left
            foreach (int i in corrections.Keys)
            {
                var oldtext = corrections[i][0];
                var newtext = corrections[i][1];

                // apply capitalization from original text to correction - all caps or initial caps
                if (text.Substring(i, oldtext.Length).All(char.IsUpper)) newtext = newtext.ToUpper();
                else if (char.IsUpper(text[i])) newtext = newtext[0].ToString().ToUpper() + newtext.Substring(1);

                text = text.Substring(0, i) + newtext + text.Substring(i + oldtext.Length);
            }

            return text;
        }
        
        // ***** GET TRANSLATABLE LANGUAGE CODES
        private void GetLanguagesForTranslate()
        {
            // send request to get supported language codes
            string uri = TEXT_TRANSLATION_API_ENDPOINT + "GetLanguagesForTranslate?scope=text";
            WebRequest WebRequest = WebRequest.Create(uri);
            WebRequest.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
            WebResponse response = null;

            // read and parse the XML response
            response = WebRequest.GetResponse();
            using (Stream stream = response.GetResponseStream())
            {
                System.Runtime.Serialization.DataContractSerializer dcs = 
                    new System.Runtime.Serialization.DataContractSerializer(typeof(List<string>));
                List<string> languagesForTranslate = (List<string>)dcs.ReadObject(stream);
                languageCodes = languagesForTranslate.ToArray();   
            }
        }
        
        //***** GET FRIENDLY LANGUAGE NAMES
        private void GetLanguageNames()
        {
            // send request to get supported language names in English
            string uri = TEXT_TRANSLATION_API_ENDPOINT + "GetLanguageNames?locale=en";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
            request.ContentType = "text/xml";
            request.Method = "POST";
            System.Runtime.Serialization.DataContractSerializer dcs = 
                new System.Runtime.Serialization.DataContractSerializer(Type.GetType("System.String[]"));
            using (System.IO.Stream stream = request.GetRequestStream())
                dcs.WriteObject(stream, languageCodes);

            // read and parse the XML response
            var response = request.GetResponse();
            string[] languageNames;
            using (Stream stream = response.GetResponseStream())
                languageNames = (string[])dcs.ReadObject(stream);

            //load the dictionary for the combo box
            for (int i = 0; i < languageNames.Length; i++)
                 languageCodesAndTitles.Add(languageNames[i], languageCodes[i]);
        }

        // ***** PERFORM TRANSLATION ON BUTTON CLICK
        private void TranslateButton_Click(object sender, EventArgs e)
        {
            string textToTranslate = TextToTranslate.Text.Trim();

            string fromLanguage = FromLanguageComboBox.SelectedValue.ToString();
            string fromLanguageCode;

            // auto-detect source language if requested
            if (fromLanguage == "Detect")
            {
                fromLanguageCode = DetectLanguage(textToTranslate);
                if (!languageCodes.Contains(fromLanguageCode))
                {
                    MessageBox.Show("The source language could not be detected automatically " + 
                        "or is not supported for translation.", "Language detection failed", 
                        MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }
            }
            else
                fromLanguageCode = languageCodesAndTitles[fromLanguage];

            string toLanguageCode = languageCodesAndTitles[ToLanguageComboBox.SelectedValue.ToString()];

            // spell-check the source text if the source language is English
            if (fromLanguageCode == "en")
            {
                if (textToTranslate.StartsWith("-"))    // don't spell check in this case
                    textToTranslate = textToTranslate.Substring(1);
                else
                {
                    textToTranslate = CorrectSpelling(textToTranslate);
                    TextToTranslate.Text = textToTranslate;     // put corrected text into input field
                }
            }

            // handle null operations: no text or same source/target languages
            if (textToTranslate == "" || fromLanguageCode == toLanguageCode)
            {
                TranslatedTextLabel.Content = textToTranslate;
                return;
            }

            // send HTTP request to perform the translation
            string uri = string.Format(TEXT_TRANSLATION_API_ENDPOINT + "Translate?text=" +
                System.Web.HttpUtility.UrlEncode(textToTranslate) + "&from={0}&to={1}", fromLanguageCode, toLanguageCode);
            var translationWebRequest = HttpWebRequest.Create(uri);
            translationWebRequest.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
            WebResponse response = null;
            response = translationWebRequest.GetResponse();

            // Parse the response XML
            Stream stream = response.GetResponseStream();
            StreamReader translatedStream = new StreamReader(stream, Encoding.GetEncoding("utf-8"));
            System.Xml.XmlDocument xmlResponse = new System.Xml.XmlDocument();
            xmlResponse.LoadXml(translatedStream.ReadToEnd());

            // Update the translation field
            TranslatedTextLabel.Content = xmlResponse.InnerText;
        }

    }
}
```

### MainWindow.xaml

This file defines the user interface for the application, a WPF form. If you want to design your own version of the form, you do not need this XAML.

```xml
<Window x:Class="MSTranslatorTextDemo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:MSTranslatorTextDemo"
        mc:Ignorable="d"
        Title="Microsoft Translator" Height="400" Width="700" BorderThickness="0">
    <Grid>
        <Label x:Name="label" Content="Microsoft Translator" HorizontalAlignment="Left" Margin="39,6,0,0" VerticalAlignment="Top" Height="49" FontSize="26.667"/>
        <TextBox x:Name="TextToTranslate" HorizontalAlignment="Left" Height="23" Margin="42,160,0,0" TextWrapping="Wrap" VerticalAlignment="Top" Width="600" FontSize="14" TabIndex="3"/>
        <Label x:Name="EnterTextLabel" Content="Text to translate:" HorizontalAlignment="Left" Margin="40,129,0,0" VerticalAlignment="Top" FontSize="14"/>
        <Label x:Name="toLabel" Content="Translate to:" HorizontalAlignment="Left" Margin="304,58,0,0" VerticalAlignment="Top" FontSize="14"/>

        <Button x:Name="TranslateButton" Content="Translate" HorizontalAlignment="Left" Margin="39,206,0,0" VerticalAlignment="Top" Width="114" Height="31" Click="TranslateButton_Click" FontSize="14" TabIndex="4" IsDefault="True"/>
        <ComboBox x:Name="ToLanguageComboBox" 
                HorizontalAlignment="Left" 
                Margin="306,88,0,0" 
                VerticalAlignment="Top" 
                Width="175" FontSize="14" TabIndex="2">

        </ComboBox>
        <Label x:Name="fromLabel" Content="Translate from:" HorizontalAlignment="Left" Margin="40,58,0,0" VerticalAlignment="Top" FontSize="14"/>
        <ComboBox x:Name="FromLanguageComboBox" 
            HorizontalAlignment="Left" 
            Margin="42,88,0,0" 
            VerticalAlignment="Top" 
            Width="175" FontSize="14" TabIndex="1"/>
        <Label x:Name="TranslatedTextLabel" Content="Translation appears here" HorizontalAlignment="Left" Margin="39,255,0,0" VerticalAlignment="Top" Width="620" FontSize="14" Height="85" BorderThickness="0"/>
    </Grid>
</Window>
```


## Service endpoints

The Microsoft Translator service has numerous endpoints that provide various pieces of translation functionality. The three we use in this tutorial are:

|||
|-|-|
|`GetLanguagesForTranslate`|Returns a list of short language codes that represent the languages available for use in translation.|
|`GetLanguageNames`|Given a list of short language codes, returns the names of these languages in a specified language.|
|`Translate`|Given source text, a source language code, and a target language code, returns a translation of the source text to the target language.|

> [!TIP]
> The `Translate` endpoint accepts the text to be translated in the query string of an HTTP `GET` request. Due to query string length limitations, this endpoint is suited for translation of smallish text&mdash;up to a few paragraphs. The `TranslateArray` endpoint uses HTTP `POST` and does not have this limitation. It can also translate multiple documents at once.

## The translation app

Our translator application's user interface is built using Windows Presentation Foundation (WPF). Create a new WPF project in Visual Studio by following these steps.

* From the **File** menu, choose **New > Project**.
* In the New Project window, open **Installed > Templates > Visual C#**. A list of the available project templates appears in the center of the dialog.
* Make sure **.NET Framework 4.5.2** is chosen in the drop-down menu above the project template list.
* Click **WPF App (.NET Framework)** in the project template list.
* Using the fields at the bottom of the dialog, name the new project and the solution that contains it.
* Click **OK** to create the new project and the solution.

![[Creating a new WPF app in Visual Studio]](media/translator-text-csharp-new-project.png)

Add a reference to the `System.Web.Extensions` assembly to your project. This assembly includes the functionality we need to parse the JSON responses from the Text Analytics and Bing Spell Check services.

Now find the `MainWindow.xaml` file in the Solution Explorer and open it. It's blank initially. Here's what the finished user interface should look like, annotated with the names of the controls in blue. Use the same names for the controls in your user interface, since they also appear in the code.

![[Annotated view of main window in Visual Studio designer]](media/translator-text-csharp-xaml.png)

> [!NOTE]
> The source code for this tutorial includes the XAML source for this form. You may paste it to your project instead of building the form in Visual Studio.

* `FromLanguageComboBox` *(ComboBox)* - Displays a list of the languages supported by Microsoft Translator for text translation. The user selects the language they are translating from.
* `ToLanguageComboBox` *(ComboBox)* - Displays the same list of languages as `FromComboBox`, but is used to select the language the user is translating to.
* `TextToTranslate` *(TextBox)* - The user enters the text to be translated here.
* `TranslateButton` *(Button)* - The user clicks this button (or presses Enter) to translate the text.
* `TranslatedTextLabel` *(Label)* - The translation for the user's text appears here.

If you're making your own version of this form, it isn't necessary to make it *exactly* like ours. But make sure the language drop-downs are wide enough to avoid cutting off a language name.

## The MainWindow class

The code-behind file `MainWindow.xaml.cs` is where the code goes that makes the program do what it does. The work happens at two times:

* When the program starts. When `MainWindow` is instantiated, we retrieve the language list using Translator's `GetLanguagesForTranslate` and `GetLanguageNames` APIs and populate our drop-down menus with them. This task is done once, at the beginning of each session.

* When the user clicks the **Translate** button, we retrieve the user's language selections and the text they entered. Then we call the `Translate` API to perform the translation. We may also call other functions to determine the language of the text and to correct its spelling before translation.

Let's look at how we begin our class:

```cs
public partial class MainWindow : Window
{
    // Translator text subscription key from Microsoft Azure dashboard
    const string TEXT_TRANSLATION_API_SUBSCRIPTION_KEY = "YOUR_KEY_GOES_HERE";
    const string TEXT_ANALYTICS_API_SUBSCRIPTION_KEY   = "YOUR_KEY_GOES_HERE";
    const string BING_SPELL_CHECK_API_SUBSCRIPTION_KEY = "YOUR_KEY_GOES_HERE";

    const string TEXT_TRANSLATION_API_ENDPOINT = "https://api.microsofttranslator.com/v2/Http.svc/";
    const string TEXT_ANALYTICS_API_ENDPOINT   = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/";
    const string BING_SPELL_CHECK_API_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/";

    private string[] languageCodes;     // array of language codes

    // Dictionary to map language code from friendly name (sorted case-insensitively on language name)
    private SortedDictionary<string, string> languageCodesAndTitles = 
        new SortedDictionary<string, string>(Comparer<string>.Create((a, b) => string.Compare(a, b, true)));

    public MainWindow()
    {
        // at least show an error dialog when we get an unexpected error
        AppDomain.CurrentDomain.UnhandledException += new UnhandledExceptionEventHandler(HandleExceptions);

        if (TEXT_TRANSLATION_API_SUBSCRIPTION_KEY.Length != 32 
            || TEXT_ANALYTICS_API_SUBSCRIPTION_KEY.Length != 32 
            || BING_SPELL_CHECK_API_SUBSCRIPTION_KEY.Length != 32)
        {
            MessageBox.Show("One or more invalid API subscription keys.\n\n" +
                "Put your keys in the *_API_SUBSCRIPTION_KEY variables in MainWindow.xaml.cs.", 
                "Invalid Subscription Key(s)", MessageBoxButton.OK, MessageBoxImage.Error);
            System.Windows.Application.Current.Shutdown();
        }
        else
        {
            InitializeComponent();          // start the GUI
            GetLanguagesForTranslate();     // get codes of languages that can be translated
            GetLanguageNames();             // get friendly names of languages
            PopulateLanguageMenus();        // fill the drop-down language lists
        }
    }
// more to come
}
```

Two member variables declared here hold information about our languages:

|||
|-|-|
|`languageCodes`<br>array of string|Caches the language codes. The Translator service uses short codes, such as `en` for English, to identify languages.|
|`languageCodesAndTitles`<br>SortedDictionary|Maps the "friendly" names in the user interface back to the short codes used in the API. Kept sorted alphabetically without regard for case.|

The first code executed by our application is the `MainWindow` constructor. First, we set up the method `HandleExceptions` as the global error handler. This way, we at least get an error alert if any exception isn't handled.

Next, we check to make sure the API subscription keys are all exactly 32 characters long. If they aren't, the most likely reason is that *someone* hasn't pasted in their API keys (tsk). In this case, we display an error message and bail out. (Passing this test doesn't mean the keys are valid, of course.)

If we have keys that are at least the right length, the `InitializeComponent()` call gets the user interface rolling by locating, loading, and instantiating the XAML description of the main application window.

Finally, we set up the language drop-down menus. This task requires three separate method calls. We go over these methods in detail in the following sections.

## Get supported languages

The Microsoft Translator service supports a total of 61 languages at this writing, and more may be added from time to time. So it's best not to hard-code the supported languages in your program. Instead, ask the Translator service what languages it supports. Any supported language can be translated to any other supported language.

Obtaining the list of supported languages requires calls to two different Translator endpoints. You need both calls because the names of the supported languages are themselves available in any supported language. First you retrieve a list of short the codes that identify the languages in a non-locale-specific way. Then you get the corresponding names of these languages in English&mdash;or any other supported language, but our tutorial uses English.

The first API, `GetLanguagesForTranslate`, gives you the language codes of the supported languages within a *scope.* The scope specifies the purpose for which you want to use the languages. The result is a list of the codes for the languages available for that purpose. The `text` scope gives us a list of the languages supported for text translation.

The language codes are mostly two-letter ISO-639-1 codes: `en` for English, `fr` for French, `es` for Spanish, `de` for German, and so on. But some are more specific. For example, there are two codes for Mandarin: `zh-CHS` for Chinese Simplified and `zh-CHT` for Chinese Traditional. There's also `yue` for Cantonese.

The second API, `GetLanguageNames`, accepts a list of language codes and a locale (a language code). It returns a list of the corresponding language names in the specified language. If you pass `ru` as the locale, then, you get back the Russian names for the specified languages.

Both of these endpoints return XML responses containing a single `ArrayOfString` element. The `ArrayOfString` contains individual `string` elements holding the language codes or names. We use the C# `DataContractSerializer` class to parse the XML responses and extract the strings.

With this background knowledge, we create separate methods to retrieve the language codes and their names.

```cs
// ***** GET TRANSLATABLE LANGAUGE CODES
private void GetLanguagesForTranslate()
{
    // send request to get supported language codes
    string uri = TEXT_TRANSLATION_API_ENDPOINT + "GetLanguagesForTranslate?scope=text";
    WebRequest WebRequest = WebRequest.Create(uri);
    WebRequest.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
    WebResponse response = null;

    // read and parse the XML response
    response = WebRequest.GetResponse();
    using (Stream stream = response.GetResponseStream())
    {
        System.Runtime.Serialization.DataContractSerializer dcs = 
            new System.Runtime.Serialization.DataContractSerializer(typeof(List<string>));
        List<string> languagesForTranslate = (List<string>)dcs.ReadObject(stream);
        languageCodes = languagesForTranslate.ToArray();   
    }
}
```

`GetLanguagesForTranslate()` first creates the HTTP request. The `?scope=text` query string specifies that we want the languages supported for text translation. We add the access token to our requests' headers. After the request completes, we parse the XML and convert it to an array.

Our other method, `GetLanguageNames()`, performs the request to get the localized names of the languages. We can get the language names themselves in any supported language. For example, in German, language `de` (German) is "Deutsch", while in Spanish it is "Alemán." We have hard-coded a locale of English (`en`) in the request.

```cs
private void GetLanguageNames()
{
    // send request to get supported language names in English
    string uri = TEXT_TRANSLATION_API_ENDPOINT + "GetLanguageNames?locale=en";
    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
    request.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
    request.ContentType = "text/xml";
    request.Method = "POST";
    System.Runtime.Serialization.DataContractSerializer dcs = 
        new System.Runtime.Serialization.DataContractSerializer(Type.GetType("System.String[]"));
    using (System.IO.Stream stream = request.GetRequestStream())
        dcs.WriteObject(stream, languageCodes);

    // read and parse the XML response
    var response = request.GetResponse();
    string[] languageNames;
    using (Stream stream = response.GetResponseStream())
        languageNames = (string[])dcs.ReadObject(stream);

    //load the dictionary for the combo box
    for (int i = 0; i < languageNames.Length; i++)
            languageCodesAndTitles.Add(languageNames[i], languageCodes[i]);
}
```
We post the list of language codes, obtained earlier, as an XML body to the `GetLanguageNames` endpoint. The language names come back in an XML `ArrayOfString` container just like the language codes, so we use similar code to parse the response to an array of strings. The language codes and names are in the same order. Now we can easily create the `languageCodesAndTitles` dictionary to map the friendly names back to their codes. (The drop-down menus in our form display the friendly names, but we need the codes to request the translation.)

## Populate the language menus

Most of our user interface is defined in XAML, so we don't need to do much to set it up besides call `InitializeComponent()`. The only other thing we need to do is add the friendly language names to the To and From drop-downs, which is done in `PopulateLanguageMenus()`.

```cs
private void PopulateLanguageMenus()
{
    // Add option to automatically detect the source language
    FromLanguageComboBox.Items.Add("Detect");

    int count = languageCodesAndTitles.Count;
    foreach (string menuItem in languageCodesAndTitles.Keys)
    {
        FromLanguageComboBox.Items.Add(menuItem);
        ToLanguageComboBox.Items.Add(menuItem);
    }

    // set default languages
    FromLanguageComboBox.SelectedItem = "Detect";
    ToLanguageComboBox.SelectedItem = "English";
}
```

Populating the menus is a straightforward matter of iterating over the `languageCodesAndTitles` dictionary and adding each key, which is the "friendly" name, to both menus. After populating the menus, we set the default To and From languages to Detect (to auto-detect the language) and English.

> [!TIP]
> If we don't set a default selection for our menus, the user can click **Translate** without choosing a To or From language. The defaults eliminate the need to deal with this problem.

Now `MainWindow` has been initialized, creating the user interface. We don't get control again until the user clicks the **Translate**  button.

## Perform translation

When the user clicks **Translate**, WPF invokes the `TranslateButton_Click()` event handler, shown here.

```cs
private void TranslateButton_Click(object sender, EventArgs e)
{
    string textToTranslate = TextToTranslate.Text.Trim();

    string fromLanguage = FromLanguageComboBox.SelectedValue.ToString();
    string fromLanguageCode;

    // auto-detect source language if requested
    if (fromLanguage == "Detect")
    {
        fromLanguageCode = DetectLanguage(textToTranslate);
        if (!languageCodes.Contains(fromLanguageCode))
        {
            MessageBox.Show("The source language could not be detected automatically " + 
                "or is not supported for translation.", "Language detection failed", 
                MessageBoxButton.OK, MessageBoxImage.Error);
            return;
        }
    }
    else
        fromLanguageCode = languageCodesAndTitles[fromLanguage];

    string toLanguageCode = languageCodesAndTitles[ToLanguageComboBox.SelectedValue.ToString()];

    // spell-check the source text if the source language is English
    if (fromLanguageCode == "en")
    {
        if (textToTranslate.StartsWith("-"))    // don't spell check in this case
            textToTranslate = textToTranslate.Substring(1);
        else
        {
            textToTranslate = CorrectSpelling(textToTranslate);
            TextToTranslate.Text = textToTranslate;     // put corrected text into input field
        }
    }

    // handle null operations: no text or same source/target languages
    if (textToTranslate == "" || fromLanguageCode == toLanguageCode)
    {
        TranslatedTextLabel.Content = textToTranslate;
        return;
    }

    // send HTTP request to perform the translation
    string uri = string.Format(TEXT_TRANSLATION_API_ENDPOINT + "Translate?text=" +
        System.Web.HttpUtility.UrlEncode(textToTranslate) + "&from={0}&to={1}", fromLanguageCode, toLanguageCode);
    var translationWebRequest = HttpWebRequest.Create(uri);
    translationWebRequest.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
    WebResponse response = null;
    response = translationWebRequest.GetResponse();

    // Parse the response XML
    Stream stream = response.GetResponseStream();
    StreamReader translatedStream = new StreamReader(stream, Encoding.GetEncoding("utf-8"));
    System.Xml.XmlDocument xmlResponse = new System.Xml.XmlDocument();
    xmlResponse.LoadXml(translatedStream.ReadToEnd());

    // Update the translation field
    TranslatedTextLabel.Content = xmlResponse.InnerText;
}
```

Here, we first retrieve the To and From languages, along with the text the user has entered, from the form.

If the source language is set to Detect, we call `DetectLanguage()` to determine the language of the text. The text might be in a language that the Translator APIs don't support (many more languages can be detected than can be translated), or the Text Analytics API might not be able to detect it. In that case, we display a message to inform the user and return without translating.

If the source language is English (whether specified or detected), we spell-check the text with `CorrectSpelling()` and apply any corrections. The corrected text is stuffed back into the input field so the user knows the correction was made. (The user may precede the text being translated with a hyphen to suppress spelling correction.)

If the user has not entered any text, or if the To and From languages are the same, no translation is necessary. In this case, we avoid making the request.

The code to perform the translation request should look familiar. We build the URI, create a request, send it, and parse the response. To display the text, we store it in the `TranslatedTextLabel` control.

> [!NOTE]
> This tutorial focuses on the Microsoft Translator service, so we don't cover the `DetectLanguage()` and `CorrectSpelling()` methods in detail. The Text Analytics and Bing Spell Check services provide responses in JSON rather than XML, and Text Analytics requires that the request be formatted as JSON as well. These characteristics account for most code differences from the methods we've already seen.

## Next steps

> [!div class="nextstepaction"]
> [Microsoft Translator Text API reference](http://docs.microsofttranslator.com/text-translate.html)
