---
title: "Tutorial: Create a translation app with WPF, C#  - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll create a WPF application that uses Cognitive Service APIs for text translation, language detection, and spell checking with a single subscription key. Keep in mind that WPF applications are Windows only.
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

In this tutorial, you'll build a WPF application that uses Azure Cognitive Services for text translation, language detection, and spell checking with a single subscription key. Specifically, your application will call APIs from Translator Text and [Bing Spell Check](https://azure.microsoft.com/services/cognitive-services/spell-check/).

This table lists each of the services that we'll use in this tutorial. Follow the link to browse the API reference for each feature.

| Service | Feature | Description |
|---------|---------|-------------|
| Translator Text | [Get Languages](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-languages) | Retrieve a complete list of supported languages for text translation. |
| Translator Text | [Translate](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate) | Translate text into more than 75 languages. |
| Translator Text | [Detect](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-detect) | Detect the language of the input text. Includes confidence score for detection. |
| Bing Spell Check | [Spell Check](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference) | Correct spelling errors to improve translation accuracy. |

Here's what we'll cover in this tutorial:

> [!div class="checklist"]
> * Prerequisites
> * Create a WPF project in Visual Studio
> * Add assemblies and NuGet packages to your project
> * Use the Translator Text API to translate text and detect the source language
> * Use the Bing Spell Check API to validate your input and improve translation accuracy
> * Configure your application front-end with XAML

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
2. The assemblies tab lists all .NET Framework assemblies that are available to reference. Use the search bar in the upper-right of the screen to search for these references and add them to your project:
   * [System.Runtime.Serialization](https://docs.microsoft.com/dotnet/api/system.runtime.serialization?view=netframework-4.7.2)
   * [System.Web](https://docs.microsoft.com/dotnet/api/system.web?view=netframework-4.7.2)
   * [System.Web.Extensions](https://docs.microsoft.com/dotnet/api/system.web?view=netframework-4.7.2)
   ![Add assembly references](media/add-assemblies-sample.png)
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
