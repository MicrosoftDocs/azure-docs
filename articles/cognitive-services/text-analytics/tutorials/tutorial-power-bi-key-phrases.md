---
title: Azure Cognitive Services, Text Analytics With Power BI | Microsoft Docs
description: Learn how to use Text Analytics to extract key phrases from text stored in Power BI.
services: cognitive-services
author: luiscabrer
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 9/6/2017
ms.author: luisca
---
# Text Analytics with Power BI

Microsoft Power BI distills your organization's data into beautiful reports, then distributes them across your organization for faster, deeper insight. The Text Analytics service, part of Cognitive Services in Microsoft Azure, can extract the most important phrases from text via its Key Phrases API. Together, these tools can help you quickly see what your customers are talking about and how they feel about it. 

In this tutorial, you'll see how to integrate Power BI Desktop and the Key Phrases API to extract the most important phrases from customer feedback using a custom Power Query function. We'll also create a Word Cloud from these phrases.

## Prerequisites

To do this tutorial, you need:

> [!div class="checklist"]
> * Microsoft Power BI Desktop. [Download at no charge]((https://powerbi.microsoft.com/)).
> * A Microsoft Azure account. [Start a free trial](https://azure.microsoft.com/free/) or [sign in](https://portal.azure.com/).
> * A subscription key for Text Analytics. [Sign up](../../cognitive-services-apis-create-account.md), then [get your key](../how-tos/text-analytics-how-to-access-key.md).
> * Customer comments. [Get our example data](https://aka.ms/cogsvc/ta) or use your own.

## Loading customer data

To get started, open Power BI Desktop and load the Comma-Separated Value (CSV) file `FabrikamComments.csv`. This file represents a day's worth of hypothetical activity in a fictional small company's support forum.

> [!NOTE]
> If you have your own messages and wish to work with them in this tutorial, feel free to load them instead. Power BI can use data from a wide variety of sources, such as Facebook or a SQL database. Modify or skip steps as needed.

In the main Power BI Desktop window, find the External Data group of the Home ribbon. Choose **Text/CSV** in the **Get Data** drop-down menu in this group.

![[The Get Data button]](../media/tutorials/power-bi/get-data-button.png)

The Open dialog appears. Navigate to your Downloads folder, or whatever folder contains the sample data file. Click `FabrikamComments.csv`, then the **Open** button. The CSV import dialog appears.

![[The CSV Import dialog]](../media/tutorials/power-bi/csv-import.png)

The CSV import dialog lets you verify that Power BI Desktop has correctly detected the character set, delimiter, header rows, and column types. This information is all correct, so we click **Load**.

To see the loaded data, switch to the Data view using the Data View button along the left edge of the Power BI workspace. A table opens containing our data, like in Microsoft Excel.

![[The initial view of the imported data]](../media/tutorials/power-bi/initial-data-view.png)

## Preparing the data

You may need to transform your data in Power BI Desktop before it's ready to be processed by the Key Phrases service.

Our data, for example, contains both a `subject` field and a `comment` field. We should consider text in both of these fields, not just `comment`, when we extract key phrases. The Merge Columns function in Power BI Desktop makes this task easy.

Open the Query Editor from the main Power BI Desktop window by clicking **Edit Queries** in the External Data group in the Home ribbon. Select "FabrikamComments" in the Queries list at the left side of the window if it is not already selected.

Now select both the `subject` and `comment` columns in the table. You may need to scroll horizontally to see these columns. First click the `subject` column header, then hold down the Control key and click the `comment` column header.

![[Selecting fields to be merged]](../media/tutorials/power-bi/select-columns.png)

In the Text Columns group of the Transform ribbon, click **Merge Columns**. The Merge Columns dialog appears.

![[Merging fields using the Merge Columns dialog]](../media/tutorials/power-bi/merge-columns.png)

In the Merge Columns dialog, choose Tab as the separator, then click **OK.** Done!

You might also consider filtering out blank messages using the Remove Empty filter or removing unprintable characters using the Clean transformation. If your data contains a column like the `spamscore` column in our sample file, you can skip "spam" comments using a Number Filter.

## Understanding the API

The Key Phrases API can process up to a thousand text documents per HTTP request. Power BI prefers to deal with records one at a time, though, so our calls to the API will contain only a single document. [The API](//westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) requires the following fields for each document being processed.

| | |
| - | - |
| `id`  | A unique identifier for this document within the request. The response also contains this field. That way, if you process multiple documents, you can easily associate the extracted key phrases with the document they came from. We are processing one document per request, so we already know which document the response is associated with, and `id` can be the same in each request.|
| `text`  | The text to be processed. We get it from the `Merged` column we created, which contains the combined subject line and comment text. The Key Phrases API requires this data be no longer than about 5,000 characters.|
| `language` | The code representing the language the document is written in. All our messages are in English, so we can hard-code language `en` in our query.|

We need to combine these fields into a JSON (JavaScript Object Notation) document for submission to the Key Phrases API. The response from this request is also a JSON document, and we must parse it and fish out the key phrases.

## Creating a custom function

Now we're ready to create the custom function that will integrate Power BI and Text Analytics. Power BI Desktop invokes the function for each row of the table and creates a new column with the results.

The function receives the text to be processed as a parameter. It converts data to and from the required JavaScript Object Notation (JSON) and makes the HTTP request to the Key Phrases API endpoint. After parsing the response, the function returns a string containing a comma-separated list of the extracted key phrases.

> [!NOTE]
> Power BI Desktop custom functions are written in the [Power Query M formula language](https://msdn.microsoft.com/library/mt211003.aspx), or just "M" for short. M is a functional programming language based on [F#](http://www.tryfsharp.org/). You don't need to be a programmer to finish this tutorial, though; the required code is included below.

You should still be in the Query Editor window. From the Home ribbon, click **New Source** (in the New Query group) and choose **Blank Query** from the drop-down menu. 

A new query, initially named Query1, appears in the Queries list. Double-click this entry and name it `KeyPhrases`.

Now open the Advanced Editor window by clicking **Advanced Editor** in the Query group of the Home ribbon. Delete the code that's already in that window and paste in the following code. 

```fsharp
// Returns key phrases from the text in a comma-separated list
(text) => let
    apikey      = "YOUR_API_KEY_HERE",
    endpoint    = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases",
    jsontext    = Text.FromBinary(Json.FromValue(Text.Start(Text.Trim(text), 5000))),
    jsonbody    = "{ documents: [ { language: ""en"", id: ""0"", text: " & jsontext & " } ] }",
    bytesbody   = Text.ToBinary(jsonbody),
    headers     = [#"Ocp-Apim-Subscription-Key" = apikey],
    bytesresp   = Web.Contents(endpoint, [Headers=headers, Content=bytesbody]),
    jsonresp    = Json.Document(bytesresp),
    keyphrases  = Text.Lower(Text.Combine(jsonresp[documents]{0}[keyPhrases], ", "))
in  keyphrases
```

Also paste in your Text Analytics API key, obtained from the Microsoft Azure dashboard, in the line starting with `apikey`. (Be sure to leave the quotation marks before and after the key.) Then click **Done.**

## Using the function

Now we can use the custom function to obtain the key phrases contained in each of our customer comments and store them in a new column in the table. 

Still in the Query Editor, change to the Add Column ribbon and click the **Invoke Custom Function** button in the General group.

![[Invoke Custom Function button]](../media/tutorials/power-bi/invoke-custom-function-button.png)<br><br>

In the Invoke Custom Function dialog, enter `keyphrases` as the name of the new column. Choose our custom function, `KeyPhrases`, as the Function Query. 

A new field appears in the dialog, asking which field we want to pass to our function as the `text` parameter. Choose `Merged` (the column we created earlier by merging the subject and message fields) from the drop-down menu.

![[Invoking a custom function]](../media/tutorials/power-bi/invoke-custom-function.png)

Finally, click **OK.**

If everything's ready, Power BI calls our function once for each row in our table, performing the Key Phrases queries and adding the new column to the table. But before that happens, you may need to specify authentication and privacy settings.

## Authentication and privacy

After you close the Invoke Custom Function dialog, a banner may appear asking you to specify how to connect to the Key Phrases endpoint.

![[credentials banner]](../media/tutorials/power-bi/credentials-banner.png)

Click **Edit Credentials,** make sure Anonymous is selected in the dialog, then click **Connect.** 

> [!NOTE]
> Why anonymous? The Text Analytics service authenticates you using the API key, so Power BI does not need to provide credentials for the HTTP request itself.

![[setting authentication to anonymous]](../media/tutorials/power-bi/access-web-content.png)

If you see the Edit Credentials banner even after choosing anonymous access, you may have forgotten to paste in your API key. Check the `KeyPhrases` custom function in the Advanced Editor to make sure it's there.

Next, a banner may appear asking you to provide information about your data sources' privacy. 

![[privacy banner]](../media/tutorials/power-bi/privacy-banner.png)

Click **Continue** and choose Public for each of the data sources in the dialog. Then click **Save.**

![[setting data source privacy]](../media/tutorials/power-bi/privacy-dialog.png)

## Creating the word cloud

Once you have dealt with any banners that appear, click **Close & Apply** in the Home ribbon to close the Query Editor.

Power BI Desktop takes a moment to make the necessary HTTP requests. For each row in the table, the new `keyphrases` column contains the key phrases detected in the text by the Key Phrases API. 

Let's use this column to generate a word cloud. To get started, click the Report button in the main Power BI Desktop window, to the left of the workspace.

> [!NOTE]
> Why use extracted key phrases to generate a word cloud, rather than the full text of every comment? The key phrases provide us with the *important* words from our customer comments, not just the *most common* words. Also, word sizing in the resulting cloud isn't skewed by the frequent use of a word in a relatively small number of comments.

If you don't already have the Word Cloud custom visual installed, install it. In the Visualizations panel to the right of the workspace, click the three dots (**...**) and choose **Import From Store**. Then search for "cloud" and click the **Add** button next the Word Cloud visual. Power BI installs the Word Cloud visual and lets you know it installed successfully.

![[adding a custom visual]](../media/tutorials/power-bi/add-custom-visuals.png)<br><br>

Now, let's make our word cloud!

![[Word Cloud icon in visualizations panel]](../media/tutorials/power-bi/visualizations-panel.png)

First, click the Word Cloud icon in the Visualizations panel. A new report appears in the workspace. Drag the `keyphrases` field from the Fields panel to the Category field in the Visualizations panel. The word cloud appears inside the report.

Now switch to the Format page of the Visualizations panel. In the Stop Words category, turn on **Default Stop Words** to eliminate short, common words like "of" from the cloud. 

![[activating default stop words]](../media/tutorials/power-bi/default-stop-words.png)

Down a little further in this panel, turn off **Rotate Text** and **Title**.

![[activate focus mode]](../media/tutorials/power-bi/word-cloud-focus-mode.png)

Click the Focus Mode tool in the report to get a better look at our word cloud. This expands the word cloud to fill the entire workspace, as shown below.

![[A Word Cloud]](../media/tutorials/power-bi/word-cloud.png)

## More Text Analytics services

The Text Analytics service, one of the Cognitive Services offered by Microsoft Azure, also provides sentiment analysis and language detection. The language detection in particular is useful if your customer feedback is not all in English.

Both of these other APIs are very similar to the Key Phrases API. Near-identical custom functions can thus be used to integrate them with Power BI Desktop. Just create a blank query and paste the appropriate code below into the Advanced Editor, as you did earlier. (Don't forget your subscription key!) Then, as before, use the function to add a new column to the table.

The Sentiment Analysis function below returns a score indicating how positive the sentiment expressed in the text is.

```fsharp
// Returns the sentiment score of the text, from 0.0 (least favorable) to 1.0 (most favorable)
(text) => let
    apikey      = "YOUR_API_KEY_HERE",
    endpoint    = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
    jsontext    = Text.FromBinary(Json.FromValue(Text.Start(Text.Trim(text), 5000))),
    jsonbody    = "{ documents: [ { language: ""en"", id: ""0"", text: " & jsontext & " } ] }",
    bytesbody   = Text.ToBinary(jsonbody),
    headers     = [#"Ocp-Apim-Subscription-Key" = apikey],
    bytesresp   = Web.Contents(endpoint, [Headers=headers, Content=bytesbody]),
    jsonresp    = Json.Document(bytesresp),
    sentiment   = jsonresp[documents]{0}[score]
in  sentiment
```

Here are two versions of a Language Detection function. The first returns the ISO language code (e.g. `en` for English), while the second returns the "friendly" name (e.g. `English`). You may notice that only the last line of the body differs between the two versions.

```fsharp
// Returns the two-letter language code (e.g. en for English) of the text
(text) => let
    apikey      = "YOUR_API_KEY_HERE",
    endpoint    = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages",
    jsontext    = Text.FromBinary(Json.FromValue(Text.Start(Text.Trim(text), 5000))),
    jsonbody    = "{ documents: [ { language: ""en"", id: ""0"", text: " & jsontext & " } ] }",
    bytesbody   = Text.ToBinary(jsonbody),
    headers     = [#"Ocp-Apim-Subscription-Key" = apikey],
    bytesresp   = Web.Contents(endpoint, [Headers=headers, Content=bytesbody]),
    jsonresp    = Json.Document(bytesresp),
    language    = jsonresp[documents]{0}[detectedLanguages]{0}[iso6391Name]
in  language
```
```fsharp
// Returns the name (e.g. English) of the language in which the text is written
(text) => let
    apikey      = "YOUR_API_KEY_HERE",
    endpoint    = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages",
    jsontext    = Text.FromBinary(Json.FromValue(Text.Start(Text.Trim(text), 5000))),
    jsonbody    = "{ documents: [ { language: ""en"", id: ""0"", text: " & jsontext & " } ] }",
    bytesbody   = Text.ToBinary(jsonbody),
    headers     = [#"Ocp-Apim-Subscription-Key" = apikey],
    bytesresp   = Web.Contents(endpoint, [Headers=headers, Content=bytesbody]),
    jsonresp    = Json.Document(bytesresp),
    language    = jsonresp[documents]{0}[detectedLanguages]{0}[name]
in  language
```

Finally, here's a variant of the Key Phrases function already presented that returns the phrases as a list object, rather than as a single string of comma-separated phrases. 

> [!NOTE]
> Returning a single string simplified our word cloud example. A list, on the other hand, is a more flexible format for working with the returned phrases in Power BI. You can manipulate list objects in Power BI Desktop using the Structured Column group in the Query Editor's Transform ribbon.

```fsharp
// Returns key phrases from the text as a list object
(text) => let
    apikey      = "YOUR_API_KEY_HERE",
    endpoint    = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases",
    jsontext    = Text.FromBinary(Json.FromValue(Text.Start(Text.Trim(text), 5000))),
    jsonbody    = "{ documents: [ { language: ""en"", id: ""0"", text: " & jsontext & " } ] }",
    bytesbody   = Text.ToBinary(jsonbody),
    headers     = [#"Ocp-Apim-Subscription-Key" = apikey],
    bytesresp   = Web.Contents(endpoint, [Headers=headers, Content=bytesbody]),
    jsonresp    = Json.Document(bytesresp),
    keyphrases  = jsonresp[documents]{0}[keyPhrases]
in  keyphrases
```

## Next steps

Learn more about the Text Analytics service, the Power Query M formula language, or Power BI.

> [!div class="nextstepaction"]
> [Text Analytics API reference](//westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6)

> [!div class="nextstepaction"]
> [Power Query M reference](//msdn.microsoft.com/library/mt211003.aspx)

> [!div class="nextstepaction"]
> [Power BI documentation](//powerbi.microsoft.com/documentation/powerbi-landing-page/)
