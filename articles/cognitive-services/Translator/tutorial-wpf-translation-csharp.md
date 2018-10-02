---
title: "Tutorial: Write a WPF application for Translator Text using C#"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll learn how to use the Translator Text API to translate text, get a localized list of supported languages, and more, by building a WPF application using C#.
services: cognitive-services
author: noellelacharite
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: tutorial
ms.date: 07/20/2018
ms.author: nolachar
---

# Tutorial: Write a WPF application for Translator Text using C&#35;

In this tutorial, you'll build an interactive text translation tool using the Translator Text API (V3), a part of Microsoft Cognitive Services in Azure. You'll learn how to:

> [!div class="checklist"]
> * Get a list of languages supported by the service
> * Perform a translation of user-entered text from one language to another

This application also features integration with two other Microsoft Cognitive Services.

|||
|-|-|
|[Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/)|Used to optionally automatically detect the source language of the text to be translated|
|[Bing Spell Check](https://azure.microsoft.com/services/cognitive-services/spell-check/)|For English source text, used to correct misspellings so translation is more accurate

![[The tutorial program running]](media/translator-text-csharp-session.png)

## Prerequisites

You'll need [Visual Studio 2017](https://www.visualstudio.com/downloads/) to run this code on Windows. (The free Community Edition will work.)

You also need subscription keys for the three Azure services used in the program. You can get a key for the Translator Text service from the Azure dashboard. A free pricing tier is available that allows you to translate up to two million characters per month at no charge.

Both the Text Analytics and Bing Spell Check services offer free trials, which you can sign up for on [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/). You may also create a subscription for either service via the Azure dashboard. Text Analytics has a free tier.

Source code for this tutorial is available below. Your subscription keys must be copied into the source code as the variables `TEXT_TRANSLATION_API_SUBSCRIPTION_KEY`, and so on, in `MainWindow.xaml.cs`.

> [!IMPORTANT]
> The Text Analytics service is available in multiple regions. The URI in this tutorial source code is in the `westus` region, which is the region used for free trials. If you have a subscription in another region, update this URI accordingly.

## Source code

This is the source code for the Microsoft Translator text API. To run the app, copy the source code into the appropriate file in a new WPF project in Visual Studio.

### MainWindow.xaml.cs

This is the code-behind file that provides the application's functionality.

```csharp
using System;
using System.Windows;
using System.Net;
using System.Net.Http;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;

// NOTE: Add assembly references to System.Runtime.Serialization, System.Web, and System.Web.Extensions.

// NOTE: Install the Newtonsoft.Json NuGet package.
using Newtonsoft.Json;

namespace MSTranslatorTextDemo
{
    /// <summary>
    /// This WPF application demonstrates the use of the Microsoft Translator Text API to translate a brief text string from
    /// one language to another. The languages are selected from a drop-down menu. The text of the translation is displayed.
    /// The source language may optionally be automatically detected. English text is spell-checked.
    /// </summary>
    public partial class MainWindow : Window
    {
        // Translator text subscription key from Microsoft Azure dashboard
        const string TEXT_TRANSLATION_API_SUBSCRIPTION_KEY = "ENTER KEY HERE";
        const string TEXT_ANALYTICS_API_SUBSCRIPTION_KEY = "ENTER KEY HERE";
        const string BING_SPELL_CHECK_API_SUBSCRIPTION_KEY = "ENTER KEY HERE";

        public static readonly string TEXT_TRANSLATION_API_ENDPOINT = "https://api.cognitive.microsofttranslator.com/{0}?api-version=3.0";
        const string TEXT_ANALYTICS_API_ENDPOINT = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/";
        const string BING_SPELL_CHECK_API_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/";

        private string[] languageCodes;     // array of language codes

        // Dictionary to map language code from friendly name (sorted case-insensitively on language name)
        private SortedDictionary<string, string> languageCodesAndTitles =
            new SortedDictionary<string, string>(Comparer<string>.Create((a, b) => string.Compare(a, b, true)));

        public MainWindow()
        {
            // at least show an error dialog if there's an unexpected error
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
                GetLanguagesForTranslate();     // get codes and friendly names of languages that can be translated
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

            // read and parse JSON response
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
            for (int i = 0; i < flaggedTokens.Length; i++)
            {
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
            string uri = String.Format(TEXT_TRANSLATION_API_ENDPOINT, "languages") + "&scope=translation";
            WebRequest WebRequest = WebRequest.Create(uri);
            WebRequest.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
            WebRequest.Headers.Add("Accept-Language", "en");
            WebResponse response = null;
            // read and parse the JSON response
            response = WebRequest.GetResponse();
            using (var reader = new StreamReader(response.GetResponseStream(), UnicodeEncoding.UTF8))
            {
                var result = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, Dictionary<string, string>>>>(reader.ReadToEnd());
                var languages = result["translation"];

                languageCodes = languages.Keys.ToArray();
                foreach (var kv in languages)
                {
                    languageCodesAndTitles.Add(kv.Value["name"], kv.Key);
                }
            }
        }

        // ***** PERFORM TRANSLATION ON BUTTON CLICK
        private async void TranslateButton_Click(object sender, EventArgs e)
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
            string endpoint = string.Format(TEXT_TRANSLATION_API_ENDPOINT, "translate");
            string uri = string.Format(endpoint + "&from={0}&to={1}", fromLanguageCode, toLanguageCode);

            System.Object[] body = new System.Object[] { new { Text = textToTranslate } };
            var requestBody = JsonConvert.SerializeObject(body);

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
                request.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
                request.Headers.Add("X-ClientTraceId", Guid.NewGuid().ToString());

                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();

                var result = JsonConvert.DeserializeObject<List<Dictionary<string, List<Dictionary<string, string>>>>>(responseBody);
                var translations = result[0]["translations"];
                var translation = translations[0]["text"];

                // Update the translation field
                TranslatedTextLabel.Content = translation;
            }
        }
    }
}
```

### MainWindow.xaml

This file defines the user interface for the application, a WPF form. If you want to design your own version of the form, you don't need this XAML.

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

The Microsoft Translator service has a number of endpoints that provide various pieces of translation functionality. The ones used in this tutorial are:

|||
|-|-|
|`Languages`|Returns the set of languages currently supported by other operations of the Translator Text API.|
|`Translate`|Given source text, a source language code, and a target language code, returns a translation of the source text to the target language.|

## The translation app

The translator application's user interface is built using Windows Presentation Foundation (WPF). Create a new WPF project in Visual Studio by following these steps.

* From the **File** menu, choose **New > Project**.
* In the New Project window, open **Installed > Templates > Visual C#**. A list of the available project templates appears in the center of the dialog.
* Make sure **.NET Framework 4.5.2** is chosen in the drop-down menu above the project template list.
* Click **WPF App (.NET Framework)** in the project template list.
* Using the fields at the bottom of the dialog, name the new project and the solution that contains it.
* Click **OK** to create the new project and the solution.

![[Creating a new WPF app in Visual Studio]](media/translator-text-csharp-new-project.png)

Add references to the following .NET framework assemblies to your project.

* System.Runtime.Serialization
* System.Web
* System.Web.Extensions

Also, install the NuGet package `Newtonsoft.Json` into your project.

Now find the `MainWindow.xaml` file in the Solution Explorer and open it. It's blank initially. Here's what the finished user interface should look like, annotated with the names of the controls in blue. Use the same names for the controls in your user interface, since they also appear in the code.

![[Annotated view of main window in Visual Studio designer]](media/translator-text-csharp-xaml.png)

> [!NOTE]
> The source code for this tutorial includes the XAML source for this form. You may paste it to your project instead of building the form in Visual Studio.

* `FromLanguageComboBox` *(ComboBox)* - Displays a list of the languages supported by Microsoft Translator for text translation. The user selects the language they are translating from.
* `ToLanguageComboBox` *(ComboBox)* - Displays the same list of languages as `FromComboBox`, but is used to select the language the user is translating to.
* `TextToTranslate` *(TextBox)* - The user enters the text to be translated here.
* `TranslateButton` *(Button)* - The user clicks this button (or presses Enter) to translate the text.
* `TranslatedTextLabel` *(Label)* - The translation for the user's text appears here.

If you're making your own version of this form, it isn't necessary to make it *exactly* like the one used here. But make sure the language drop-downs are wide enough to avoid cutting off a language name.

## The MainWindow class

The code-behind file `MainWindow.xaml.cs` is where the code goes that makes the program do what it does. The work happens at two times:

* When the program starts and `MainWindow` is instantiated, it retrieves the language list using Translator's  and  APIs and populates the drop-down menus with them. This task is done once, at the beginning of each session.

* When the user clicks the **Translate** button, the user's language selections are retrieved and the text they entered, and then the `Translate` API is called to perform the translation. Other functions might also be called to determine the language of the text and to correct its spelling before translation.

Take a look at the beginning of the class:

```csharp
public partial class MainWindow : Window
{
    // Translator text subscription key from Microsoft Azure dashboard
    const string TEXT_TRANSLATION_API_SUBSCRIPTION_KEY = "ENTER KEY HERE";
    const string TEXT_ANALYTICS_API_SUBSCRIPTION_KEY = "ENTER KEY HERE";
    const string BING_SPELL_CHECK_API_SUBSCRIPTION_KEY = "ENTER KEY HERE";

    public static readonly string TEXT_TRANSLATION_API_ENDPOINT = "https://api.cognitive.microsofttranslator.com/{0}?api-version=3.0";
    const string TEXT_ANALYTICS_API_ENDPOINT = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/";
    const string BING_SPELL_CHECK_API_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/";

    private string[] languageCodes;     // array of language codes

    // Dictionary to map language code from friendly name (sorted case-insensitively on language name)
    private SortedDictionary<string, string> languageCodesAndTitles =
        new SortedDictionary<string, string>(Comparer<string>.Create((a, b) => string.Compare(a, b, true)));

    public MainWindow()
    {
        // at least show an error dialog if there's an unexpected error
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
            GetLanguagesForTranslate();     // get codes and friendly names of languages that can be translated
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

The first code executed by the application is the `MainWindow` constructor. First, set up the method `HandleExceptions` as the global error handler. This way, there is at least an error alert if an exception isn't handled.

Next, check to make sure the API subscription keys are all exactly 32 characters long. If they aren't, the most likely reason is that *someone* hasn't pasted in their API keys. In this case, display an error message and bail out. (Passing this test doesn't mean the keys are valid, of course.)

If there are keys that are at least the right length, the `InitializeComponent()` call gets the user interface rolling by locating, loading, and instantiating the XAML description of the main application window.

Finally, set up the language drop-down menus. This task requires three separate method calls, which are covered in detail in the following sections.

## Get supported languages

The Microsoft Translator service supports a total of 61 languages at this writing, and more may be added from time to time. So it's best not to hard-code the supported languages in your program. Instead, ask the Translator service what languages it supports. Any supported language can be translated to any other supported language.

Call the `Languages` API to get the list of supported languages.

The `Languages` API takes an optional GET query parameter, *scope*. *scope* can have one of three values: `translation`, `transliteration`, and `dictionary`. This code uses the value `translation`.

The `Languages` API also takes an optional HTTP header, `Accept-Language`. The value of this header determines the language in which the names of the supported languages are returned. The value should be a well-formed BCP 47 language tag. This code uses the value `en` to get the language names in English.

The `Languages` API returns a JSON response that looks like the following.

```json
{
  "translation": {
    "af": {
      "name": "Afrikaans",
      "nativeName": "Afrikaans",
      "dir": "ltr"
    },
    "ar": {
      "name": "Arabic",
      "nativeName": "العربية",
      "dir": "rtl"
    },
...
}
```

So that language codes (for example, `af`) and language names (for example, `Afrikaans`) can be extracted, this code uses the NewtonSoft.Json method [JsonConvert.DeserializeObject](https://www.newtonsoft.com/json/help/html/M_Newtonsoft_Json_JsonConvert_DeserializeObject__1.htm).

With this background knowledge, create the following method to retrieve the language codes and their names.

```csharp
private void GetLanguagesForTranslate()
{
    // send request to get supported language codes
    string uri = String.Format(TEXT_TRANSLATION_API_ENDPOINT, "languages") + "&scope=translation";
    WebRequest WebRequest = WebRequest.Create(uri);
    WebRequest.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
    WebRequest.Headers.Add("Accept-Language", "en");
    WebResponse response = null;
    // read and parse the JSON response
    response = WebRequest.GetResponse();
    using (var reader = new StreamReader(response.GetResponseStream(), UnicodeEncoding.UTF8))
    {
        var result = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, Dictionary<string, string>>>>(reader.ReadToEnd());
        var languages = result["translation"];

        languageCodes = languages.Keys.ToArray();
        foreach (var kv in languages)
        {
            languageCodesAndTitles.Add(kv.Value["name"], kv.Key);
        }
    }
}
```

`GetLanguagesForTranslate()` first creates the HTTP request. The `scope=translation` query string parameter requests only those languages supported for text translation. The Text Translation API subscription key is added to the request headers. The `Accept-Language` header with the value `en` is added so that the supported languages are returned in English.

After the request completes, the JSON response is parsed and converted to a Dictionary, and then the language codes are added to the `languageCodes` member variable. The key/value pairs that contain the language codes and the friendly language names are looped through and added to the `languageCodesAndTitles` member variable. (The drop-down menus in the form display the friendly names, but the codes are needed to request the translation.)

## Populate the language menus

Most of the user interface is defined in XAML, so you don't need to do much to set it up besides call `InitializeComponent()`. The only other thing you need to do is add the friendly language names to the **Translate from** and **Translate to** drop-downs, which is done in `PopulateLanguageMenus()`.

```csharp
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

Populating the menus is a straightforward matter of iterating over the `languageCodesAndTitles` dictionary and adding each key, which is the "friendly" name, to both menus. After populating the menus, the default "to" and "from" languages are set to **Detect** (to auto-detect the language) and **English**.

> [!TIP]
> Without a default selection for the menus, the user can click **Translate** without first choosing a "to" or "from" language. The defaults eliminate the need to deal with this problem.

Now that `MainWindow` has been initialized and the user interface created, the code waits until the user clicks the **Translate**  button.

## Perform translation

When the user clicks **Translate**, WPF invokes the `TranslateButton_Click()` event handler, shown here.

```csharp
private async void TranslateButton_Click(object sender, EventArgs e)
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
    string endpoint = string.Format(TEXT_TRANSLATION_API_ENDPOINT, "translate");
    string uri = string.Format(endpoint + "&from={0}&to={1}", fromLanguageCode, toLanguageCode);

    System.Object[] body = new System.Object[] { new { Text = textToTranslate } };
    var requestBody = JsonConvert.SerializeObject(body);

    using (var client = new HttpClient())
    using (var request = new HttpRequestMessage())
    {
        request.Method = HttpMethod.Post;
        request.RequestUri = new Uri(uri);
        request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
        request.Headers.Add("Ocp-Apim-Subscription-Key", TEXT_TRANSLATION_API_SUBSCRIPTION_KEY);
        request.Headers.Add("X-ClientTraceId", Guid.NewGuid().ToString());

        var response = await client.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        var result = JsonConvert.DeserializeObject<List<Dictionary<string, List<Dictionary<string, string>>>>>(responseBody);
        var translations = result[0]["translations"];
        var translation = translations[0]["text"];

        // Update the translation field
        TranslatedTextLabel.Content = translation;
    }
}
```

The first step is to retrieve the "to" and "from" languages, along with the text the user has entered, from the form.

If the source language is set to **Detect**, make a call to `DetectLanguage()` to determine the language of the text. The text might be in a language that the Translator APIs don't support (many more languages can be detected than can be translated), or the Text Analytics API might not be able to detect it. In that case, display a message to inform the user and return without translating.

If the source language is English (whether specified or detected), check the spelling of the text with `CorrectSpelling()` and apply any corrections. The corrected text is stuffed back into the input field so the user knows the correction was made. (The user may precede the text being translated with a hyphen to suppress spelling correction.)

If the user has not entered any text, or if the "to" and "from" languages are the same, no translation is necessary and the request can be avoided.

The code to perform the translation request should look familiar: build the URI, create a request, send it, and parse the response. To display the text, send it to the `TranslatedTextLabel` control.

Next, pass text to the `Translate` API in a serialized JSON array in the body of a POST request. The JSON array can contain multiple pieces of text to translate, but just one is required here.

The HTTP header named `X-ClientTraceId` is optional. The value should be a GUID. The client-supplied trace ID is useful to trace requests when things don't work as expected. However, to be useful, the value of X-ClientTraceID must be recorded by the client. A client trace ID and the date of requests can help Microsoft diagnose issues that may occur.

> [!NOTE]
> This tutorial focuses on the Microsoft Translator service, so the `DetectLanguage()` and `CorrectSpelling()` methods aren't covered in detail.

## Next steps

> [!div class="nextstepaction"]
> [Microsoft Translator Text API reference](https://docs.microsoft.com/azure/cognitive-services/Translator/reference/v3-0-reference)
