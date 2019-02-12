---
title: "Tutorial: Create a translation app with WPF, C#  - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll create a Windows Presentation Foundation (WPF) application that uses Cognitive Service APIs for text translation, language detection, and spell checking with a single subscription key. This exercise will show you how to use features from the Translator Text API and Bing Spell Check API.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: tutorial
ms.date: 02/13/2019
ms.author: erhopf
---

# Tutorial: Create a translation app with WPF

In this tutorial, you'll build a [Windows Presentation Foundation (WPF)](https://docs.microsoft.com/visualstudio/designers/getting-started-with-wpf?view=vs-2017) application that uses Azure Cognitive Services for text translation, language detection, and spell checking with a single subscription key. Specifically, your application will call APIs from Translator Text and [Bing Spell Check](https://azure.microsoft.com/services/cognitive-services/spell-check/).

What is WPF? It is a UI framework that creates desktop client applications. The WPF development platform supports a broad set of application development features, including an application model, resources, controls, graphics, layout, data binding, documents, and security. It is a subset of the .NET Framework, so if you have previously built applications with the .NET Framework using ASP.NET or Windows Forms, the programming experience should be familiar. WPF uses the Extensible Application Markup Language (XAML) to provide a declarative model for application programming, which we'll review in the coming sections.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a WPF project in Visual Studio
> * Add assemblies and NuGet packages to your project
> * Create your application front-end with XAML
> * Use the Translator Text API to get languages, translate text, and detect the source language
> * Use the Bing Spell Check API to validate your input and improve translation accuracy

### Cognitive Services used in this tutorial

This is a list of the Cognitive Services used in this tutorial. Follow the link to browse the API reference for each feature.

| Service | Feature | Description |
|---------|---------|-------------|
| Translator Text | [Get Languages](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-languages) | Retrieve a complete list of supported languages for text translation. |
| Translator Text | [Translate](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate) | Translate text into more than 75 languages. |
| Translator Text | [Detect](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-detect) | Detect the language of the input text. Includes confidence score for detection. |
| Bing Spell Check | [Spell Check](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference) | Correct spelling errors to improve translation accuracy. |

## Prerequisites

Before we continue, you'll need the following:

* An Azure Cognitive Services subscription. [Get a Cognitive Services key](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#multi-service-subscription).
* A Windows machine
* [Visual Studio 2017](https://www.visualstudio.com/downloads/) - Community or Enterprise

> [!NOTE]
> We recommend creating the subscription in the West US region for this tutorial. Otherwise, you'll need to change endpoints and regions in the code as you work through this exercise.  

## Create a WPF app in Visual Studio

The first thing we need to do is set up our project in Visual Studio.

1. Open Visual Studio. Then select **File > New > Project**.
2. In the left panel, locate and select **Visual C#**. Then, select **WPF App (.NET Framework)** in the center panel.
   ![Create a WPF app in Visual Studio](media/create-wpf-project-visual-studio.png)
3. Name your project, set the framework version to **.NET Framework 4.5.2 or later**, then click **OK**.
4. Your project has been created. You'll notice that there are two tabs open: `MainWindow.xaml` and `MainWindow.xaml.cs`. Throughout this tutorial, we'll be adding code to these two files. The first for the application front-end; the latter for our calls to Translator Text and Bing Spell Check.
   ![Review your environment](media/blank-wpf-project.png)

In the next section we're going to add assemblies and a NuGet package to our project for additional functionality, like JSON parsing.

## Add references and NuGet packages to your project

Our project requires a handful of .NET Framework assemblies and NewtonSoft.Json, which we'll install using the NuGet package manager.

### Add .NET Framework assemblies

Let's add assemblies to our project to serialize and deserialize objects, and to manage HTTP requests and responses.

1. Locate your project in Visual Studio's Solution Explorer (right panel). Right click on your project, then select **Add > Reference...**. This will open **Reference Manager**.
   ![Add assembly references](media/add-assemblies-sample.png)
2. The assemblies tab lists all .NET Framework assemblies that are available to reference. Use the search bar in the upper-right of the screen to search for these references and add them to your project:
   * [System.Runtime.Serialization](https://docs.microsoft.com/dotnet/api/system.runtime.serialization?view=netframework-4.7.2)
   * [System.Web](https://docs.microsoft.com/dotnet/api/system.web?view=netframework-4.7.2)
   * [System.Web.Extensions](https://docs.microsoft.com/dotnet/api/system.web?view=netframework-4.7.2)
3. After you've added these references to your project, you can click **OK** to close **Reference Manager**.

> [!NOTE]
> If you'd like to learn more about assembly references, see [How to: Add or remove reference using the Reference Manager](https://docs.microsoft.com/visualstudio/ide/how-to-add-or-remove-references-by-using-the-reference-manager?view=vs-2017).

### Install NewtonSoft.Json

Our application will use NewtonSoft.Json to deserialize JSON objects. Follow these instructions to install the package.

1. Locate your project in Visual Studio's Solution Explorer and right click on your project. Select **Manage NuGet Packages...**.
2. Locate and select the **Browse** tab.
3. Type [NewtonSoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/) into the search bar.
   ![Locate and install NewtonSoft.Json](media/add-nuget-packages.png)
4. Select the package and click **Install**.
5. When the installation is complete, close the tab.

## Create a WPF form using XAML

In order to use your application, you're going to need a front-end. Using XAML, we'll create a form that allows users to select input and translation languages, enter text to translate, and displays the translation output.

Let's take a look at what we're building.
![WPF XAML front-end](media/translator-text-csharp-xaml.png)

The application includes these components:

| Name | Type | Description |
|------|------|-------------|
| `FromLanguageComboBox` | ComboBox | Displays a list of the languages supported by Microsoft Translator for text translation. The user selects the language they are translating from. |
| `ToLanguageComboBox` | ComboBox | Displays the same list of languages as `FromComboBox`, but is used to select the language the user is translating to. |
| `TextToTranslate` | TextBox | Allows the user to enter text to be translated. |
| `TranslateButton` | Button | Use this button to perform a translation. |
| `TranslatedTextLabel` | Label | Displays the translation. |
| `DetectedLanguageLabel` | Label | Displays the detected language of the text to be transdlated (`TextToTranslate`). |

> [!NOTE]
> We're creating this form using the XAML source code, however, you can create the form with the editor in Visual Studio.

1. In Visual Studio, select the tab for `MainWindow.xaml`.
2. Copy this code into your project and **Save**.
   ```xaml
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
           <Label x:Name="TranslatedTextLabel" Content="Translation is displayed here." HorizontalAlignment="Left" Margin="39,255,0,0" VerticalAlignment="Top" Width="620" FontSize="14" Height="85" BorderThickness="0"/>
           <Label x:Name="DetectedLanguageLabel" Content="Autodetected language is displayed here." HorizontalAlignment="Left" Margin="39,288,0,0" VerticalAlignment="Top" Width="620" FontSize="14" Height="84" BorderThickness="0"/>
       </Grid>
   </Window>
   ```
3. You should now see a preview of the application front-end in Visual Studio. It should look similar to the image above.

That's it. You're form is ready. Now let's write some code to call Text Translation and Bing Spell Check.

> [!NOTE]
> Feel free to tweak this form or create your own.

## Set up MainWindow.xaml.cs (Needs better name)

`MainWindow.xaml.cs` contains the code that controls our application. In the next few sections we're going to add code to populate our drop-down menus, and to call a handful of API exposed by Translator Text and Bing Spell Check.

* When the program starts and `MainWindow` is instantiated, the `Languages` method of the Translator Text API is called to retrieve and populate our language selection drop-downs. This happens once at the beginning of each session.
* When the **Translate** button is clicked, the user's language selection and text are retrieved, spell check is performed on the input, and the translation and detected language are displayed for the user.
  * The `Translate` method of the Translator Text API is called to translate text from `TextToTranslate`. This call also includes the `to` and `from` languages selected using the drop-down menus.
  * The `Detect` method of the Translator Text API is called to determine the text langauge of `TextToTranslate`.
  * Bing Spell Check is used to validate `TextToTranslate` and adjust misspellings.

All of our project is encapsulated in the `MainWindow : Window` class. Let's start by adding code to set your subscription key, declare endpoints for Translator Text and Bing Spell Check, and initialize the application.

1. In Visual Studio, select the tab for `MainWindow.xaml.cs`.
2. Replace the pre-populated `using` statements with the following.  
   ```csharp
   using System;
   using System.Windows;
   using System.Net;
   using System.Net.Http;
   using System.IO;
   using System.Collections.Generic;
   using System.Linq;
   using System.Text;
   using Newtonsoft.Json;
   ```
3. Locate the `MainWindow : Window` class, and replace it with this code:
   ```csharp
   {
       // This sample uses the Cognitive Services subscription key for all services. To learn more about
       // authentication options, see: https://docs.microsoft.com/azure/cognitive-services/authentication.
       const string COGNITIVE_SERVICES_KEY = "YOUR_COG_SERVICES_KEY";
       // Endpoints for Translator Text and Bing Spell Check
       public static readonly string TEXT_TRANSLATION_API_ENDPOINT = "https://api.cognitive.microsofttranslator.com/{0}?api- version=3.0";
       const string BING_SPELL_CHECK_API_ENDPOINT = "https://westus.api.cognitive.microsoft.com/bing/v7.0/spellcheck/";
       // An array of language codes
       private string[] languageCodes;

       // Dictionary to map language codes from friendly name (sorted case-insensitively on language name)
       private SortedDictionary<string, string> languageCodesAndTitles =
           new SortedDictionary<string, string>(Comparer<string>.Create((a, b) => string.Compare(a, b, true)));

       // Global exception handler to display error message and exit
       private static void HandleExceptions(object sender, UnhandledExceptionEventArgs args)
       {
           Exception e = (Exception)args.ExceptionObject;
           MessageBox.Show("Caught " + e.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
           System.Windows.Application.Current.Shutdown();
       }
       // MainWindow constructor
       public MainWindow()
       {
           // Display a message if unexpected error is encountered
           AppDomain.CurrentDomain.UnhandledException += new UnhandledExceptionEventHandler(HandleExceptions);

           if (COGNITIVE_SERVICES_KEY.Length != 32)
           {
               MessageBox.Show("One or more invalid API subscription keys.\n\n" +
                   "Put your keys in the *_API_SUBSCRIPTION_KEY variables in MainWindow.xaml.cs.",
                   "Invalid Subscription Key(s)", MessageBoxButton.OK, MessageBoxImage.Error);
               System.Windows.Application.Current.Shutdown();
           }
           else
           {
               // Start GUI
               InitializeComponent();
               // Get languages for drop-downs
               GetLanguagesForTranslate();
               // Populate drop-downs with values from GetLanguagesForTranslate
               PopulateLanguageMenus();
           }
       }
   // NOTE:
   // In the following sections, we'll add code below this.
   }
   ```

In this code block, we've declared two member variables that contain information about available languages for translation:

| Variable | Type | Description |
|----------|------|-------------|
|`languageCodes` | Array of strings |C aches the language codes. The Translator service uses short codes, such as `en` for English, to identify languages. |
|`languageCodesAndTitles` | Sorted dictionary | Maps the "friendly" names in the user interface back to the short codes used in the API. Kept sorted alphabetically without regard for case. |

Then, within the `MainWindow` constructor, we've added error handling with `HandleExceptions`. This ensures that an alert is provided if an exception isn't handled. Then a check is run to confirm the subscription key provided is 32 characters in length. An error is thrown if the key is less than/greater than 32 characters.

If there are keys that are at least the right length, the `InitializeComponent()` call gets the user interface rolling by locating, loading, and instantiating the XAML description of the main application window.

Last, we've added code to call methods to retrieve languages for translation and to populate the drop-down menus for our application front-end. Don't worry, we'll get to the code behind these calls soon.

## Get supported languages

The Translator Text API currently supports more than 75 languages. Since new language support will be added over time, we recommend calling the Languages resource exposed by Translator Text rather than hardcoding the language list in your application.

In this section we'll create a `GET` request to the Languages resource, specifying that we want a list of languages available for translation. This request doesn't need to be authenticated.

> [!NOTE]
> The Languages resource allows you to filter language support with the following query parameters: transliteration, dictionary, and translation. For more information, see [API reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-languages).

Before we go any further, let's take a look at a sample output for a call to the Languages resource:

```
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
    }
    // Additional languages are provided in the full JSON output.
}
```

From this output, we can extract the language code and the `name` of a specific language. Our application uses NewtonSoft.Json to deserialize the JSON object ([`JsonConvert.DeserializeObject`](https://www.newtonsoft.com/json/help/html/M_Newtonsoft_Json_JsonConvert_DeserializeObject__1.htm)).

Picking up where we left off in the last section, let's add a method to get supported languages to our application.

1. In Visual Studio, open the tab for `MainWindow.xaml.cs`.
2. Add this code to your project:
   ```csharp
   // ***** GET TRANSLATABLE LANGUAGE CODES
   private void GetLanguagesForTranslate()
   {
       // send request to get supported language codes
       string uri = String.Format(TEXT_TRANSLATION_API_ENDPOINT, "languages") + "&scope=translation";
       WebRequest WebRequest = WebRequest.Create(uri);
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
   // NOTE:
   // In the following sections, we'll add code below this.
   ```

The `GetLanguagesForTranslate()` method creates an HTTP GET request, and uses the `scope=translation` query string parameter is used to limit the scope of the request to supported languages for translation. The `Accept-Language` header with the value `en` is added so that the supported languages are returned in English.

The JSON response is parsed and converted to a Dictionary. Then the language codes are added to the `languageCodes` member variable. The key/value pairs that contain the language codes and the friendly language names are looped through and added to the `languageCodesAndTitles` member variable. The drop-down menus in the form display the friendly names, but the codes are needed to request the translation.

## Populate the language menus

The user interface is defined using XAML, so you don't need to do much to set it up besides call `InitializeComponent()`. The one thing you need to do is add the friendly language names to the **Translate from** and **Translate to** drop-down menus, which is done with the `PopulateLanguageMenus()` method.

1. In Visual Studio, open the tab for `MainWindow.xaml.cs`.
2. Add this code to your project below the `GetLanguagesForTranslate()` method:
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
   // NOTE:
   // In the following sections, we'll add code below this.
   ```

This method iterates over the `languageCodesAndTitles` dictionary and adds each key to both menus. After the menus are populated, the default from and to languages are set to **Detect** and **English** respectively.

> [!TIP]
> Without a default selection for the menus, the user can click **Translate** without first choosing a "to" or "from" language. The defaults eliminate the need to deal with this problem.

Now that `MainWindow` has been initialized and the user interface created, this code won't run until the **Translate**  button is clicked.

## Detect language of source text

< Description and instructions to be added.>

```csharp
// ***** DETECT LANGUAGE OF TEXT TO BE TRANSLATED
private string DetectLanguage(string text)
{
    string detectUri = string.Format(TEXT_TRANSLATION_API_ENDPOINT ,"detect");

    // create request to Text Analytics API
    HttpWebRequest detectLanguageWebRequest = (HttpWebRequest)WebRequest.Create(detectUri);
    detectLanguageWebRequest.Headers.Add("Ocp-Apim-Subscription-Key", COGNITIVE_SERVICES_KEY);
    detectLanguageWebRequest.Headers.Add("Ocp-Apim-Subscription-Region", "westus");
    detectLanguageWebRequest.ContentType = "application/json; charset=utf-8";
    detectLanguageWebRequest.Method = "POST";

    // create and send body of request
    var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
    string jsonText = serializer.Serialize(text);

    string body = "[{ \"Text\": " + jsonText + " }]";
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
    var languageInfo = jsonResponse[0];
    if (languageInfo["score"] > (decimal)0.5)
    {
        DetectedLanguageLabel.Content = languageInfo["language"];
        return languageInfo["language"];
    }
    else
        return "Unable to confidently detect input language.";
}
// NOTE:
// In the following sections, we'll add code below this.
```

## Spell check the source text

< Description and instructions to be added.>

```csharp
// ***** CORRECT SPELLING OF TEXT TO BE TRANSLATED
private string CorrectSpelling(string text)
{
    string uri = BING_SPELL_CHECK_API_ENDPOINT + "?mode=spell&mkt=en-US";

    // create request to Bing Spell Check API
    HttpWebRequest spellCheckWebRequest = (HttpWebRequest)WebRequest.Create(uri);
    spellCheckWebRequest.Headers.Add("Ocp-Apim-Subscription-Key", COGNITIVE_SERVICES_KEY);
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
// NOTE:
// In the following sections, we'll add code below this.
```

## Translate text on click

When the user clicks **Translate**, WPF invokes the `TranslateButton_Click()` event handler, shown here.

```csharp
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
        request.Headers.Add("Ocp-Apim-Subscription-Key", COGNITIVE_SERVICES_KEY);
        request.Headers.Add("Ocp-Apim-Subscription-Region", "westus");
        request.Headers.Add("X-ClientTraceId", Guid.NewGuid().ToString());

        var response = await client.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        var result = JsonConvert.DeserializeObject<List<Dictionary<string, List<Dictionary<string, string>>>>>(responseBody);
        var translation = result[0]["translations"][0]["text"];

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
