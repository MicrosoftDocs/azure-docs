---
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 12/05/2023
author: mrbullwinkle #noabenefraim
ms.author: mbullwin
---
## Prerequisites

* An Azure subscription - [Create one for free][01]
* An Azure OpenAI resource with the **text-embedding-ada-002 (Version 2)** model deployed.

  This model is currently only available in [certain regions][03].  If you don't have a resource
  the process of creating one is documented in our [resource deployment guide][04].
* [PowerShell 7.4][05]

> [!NOTE]
> Many examples in this tutorial re-use variables from step-to-step. Keep the same terminal session
> open throughout. If variables you set in a previous step are lost due to closing the terminal,
> you must begin again from the start.

[!INCLUDE [get-key-endpoint](../includes/get-key-endpoint.md)]

Create and assign persistent environment variables for your key and endpoint.

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx AZURE_OPENAI_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx AZURE_OPENAI_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell-interactive
$Env:AZURE_OPENAI_API_KEY = '<YOUR_KEY_VALUE>'
$Env:AZURE_OPENAI_ENDPOINT = '<YOUR_ENDPOINT>'
$Env:AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT = '<YOUR_DEPLOYMENT_NAME>'
```

# [Bash](#tab/bash)

```Bash
echo export AZURE_OPENAI_API_KEY="<YOUR_KEY_VALUE>" >> /etc/environment
echo export AZURE_OPENAI_ENDPOINT="<YOUR_ENDPOINT>" >> /etc/environment
echo export AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT="<YOUR_DEPLOYMENT_NAME>" >> /etc/environment
source /etc/environment
```

---

For this tutorial, we use the [PowerShell 7.4 reference documentation][06] as a well-known and safe
sample dataset. As an alternative, you might choose to explore the [Microsoft Research tools][07]
sample datasets.

Create a folder where you would like to store your project. Set your location to the project
folder. Download the dataset to your local machine using the `Invoke-WebRequest` command and then
expand the archive. Last, set your location to the subfolder containing reference information for
PowerShell version 7.4.

```powershell-interactive
New-Item '<FILE-PATH-TO-YOUR-PROJECT>' -Type Directory
Set-Location '<FILE-PATH-TO-YOUR-PROJECT>'

$DocsUri = 'https://github.com/MicrosoftDocs/PowerShell-Docs/archive/refs/heads/main.zip'
Invoke-WebRequest $DocsUri -OutFile './PSDocs.zip'

Expand-Archive './PSDocs.zip'
Set-Location './PSDocs/PowerShell-Docs-main/reference/7.4/'
```

We're working with a large amount of data in this tutorial, so we use a .NET data table object for
efficient performance. The datatable has columns **title**, **content**, **prep**,  **uri**,
**file**, and **vectors**. The **title** column is the [primary key][08].

In the next step, we load the content of each markdown file into the data table. We also use
PowerShell `-match` operator to capture known lines of text `title:` and `online version:`, and
store them in distinct columns. Some of the files don't contain the metadata lines of text, but
since they're overview pages and not detailed reference docs, we exclude them from the datatable.

```powershell-interactive
# make sure your location is the project subfolder

$DataTable = New-Object System.Data.DataTable

'title', 'content', 'prep', 'uri', 'file', 'vectors' | ForEach-Object {
    $DataTable.Columns.Add($_)
} | Out-Null
$DataTable.PrimaryKey = $DataTable.Columns['title']

$md = Get-ChildItem -Path . -Include *.md -Recurse

$md | ForEach-Object {
    $file       = $_.FullName
    $content    = Get-Content $file
    $title      = $content | Where-Object { $_ -match 'title: ' }
    $uri        = $content | Where-Object { $_ -match 'online version: ' }
    if ($title -and $uri) {
        $row                = $DataTable.NewRow()
        $row.title          = $title.ToString().Replace('title: ', '')
        $row.content        = $content | Out-String
        $row.prep           = '' # use later in the tutorial
        $row.uri            = $uri.ToString().Replace('online version: ', '')
        $row.file           = $file
        $row.vectors        = '' # use later in the tutorial
        $Datatable.rows.add($row)
    }
}
```

View the data using the `out-gridview` command (not available in Cloud Shell).

```powershell
$Datatable | out-gridview
```

Output:

:::image type="content" source="../media/tutorials/initial-datatable.png" alt-text="Screenshot of the initial DataTable results." lightbox="../media/tutorials/initial-datatable.png":::

Next perform some light data cleaning by removing extra characters, empty space, and other document
notations, to prepare the data for tokenization. The sample function `Invoke-DocPrep` demonstrates
how to use the PowerShell `-replace` operator to iterate through a list of characters you would like
to remove from the content.

```powershell-interactive
# sample demonstrates how to use `-replace` to remove characters from text content
function Invoke-DocPrep {
param(
    [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
    [string]$content
)
    # tab, line breaks, empty space
    $replace = @('\t','\r\n','\n','\r')
    # non-UTF8 characters
    $replace += @('[^\x00-\x7F]')
    # html
    $replace += @('<table>','</table>','<tr>','</tr>','<td>','</td>')
    $replace += @('<ul>','</ul>','<li>','</li>')
    $replace += @('<p>','</p>','<br>')
    # docs
    $replace += @('\*\*IMPORTANT:\*\*','\*\*NOTE:\*\*')
    $replace += @('<!','no-loc ','text=')
    $replace += @('<--','-->','---','--',':::')
    # markdown
    $replace += @('###','##','#','```')
    $replace | ForEach-Object {
        $content = $content -replace $_, ' ' -replace '  ',' '
    }
    return $content
}
```

After you create the `Invoke-DocPrep` function, use the `ForEach-Object` command to store prepared
content in the **prep** column, for all rows in the datatable. We're using a new column so the
original formatting is available if we would like to retrieve it later.

```powershell-interactive
$Datatable.rows | ForEach-Object { $_.prep = Invoke-DocPrep $_.content }
```

View the datatable again to see the change.

```powershell
$Datatable | out-gridview
```

When we pass the documents to the embeddings model, it encodes the documents into tokens and then
returns a series of floating point numbers to use in a [cosine similarity][09] search. These
embeddings can be stored locally or in a service such as [Vector Search in Azure AI Search][10].
Each document has its own corresponding embedding vector in the new **vectors** column.

The next example loops through each row in the datatable, retrieves the vectors for the
preprocessed content, and stores them to the **vectors** column. The OpenAI service throttles
frequent requests, so the example includes an **exponential back-off** as suggested by the
[documentation][11].

After the script completes, each row should have a comma-delimited list of 1536 vectors for each
document. If an error occurs and the status code is `400`, the file path, title, and error code
are added to a variable named `$errorDocs` for troubleshooting. The most common error occurs when
the token count is more than the prompt limit for the model.

```powershell-interactive
# Azure OpenAI metadata variables
$openai = @{
    api_key     = $Env:AZURE_OPENAI_API_KEY 
    api_base    = $Env:AZURE_OPENAI_ENDPOINT # should look like 'https://<YOUR_RESOURCE_NAME>.openai.azure.com/'
    api_version = '2024-02-01' # may change in the future
    name        = $Env:AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT # custom name you chose for your deployment
}

$headers = [ordered]@{
    'api-key' = $openai.api_key
}

$url = "$($openai.api_base)/openai/deployments/$($openai.name)/embeddings?api-version=$($openai.api_version)"

$Datatable | ForEach-Object {
    $doc = $_

    $body = [ordered]@{
        input = $doc.prep
    } | ConvertTo-Json

    $retryCount = 0
    $maxRetries = 10
    $delay      = 1
    $docErrors = @()

    do {
        try {
            $params = @{
                Uri         = $url
                Headers     = $headers
                Body        = $body
                Method      = 'Post'
                ContentType = 'application/json'
            }
            $response = Invoke-RestMethod @params
            $Datatable.rows.find($doc.title).vectors = $response.data.embedding -join ','
            break
        } catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                $retryCount++
                [int]$retryAfter = $_.Exception.Response.Headers |
                    Where-Object key -eq 'Retry-After' |
                    Select-Object -ExpandProperty Value

                # Use delay from error header
                if ($delay -lt $retryAfter) { $delay = $retryAfter++ }
                Start-Sleep -Seconds $delay
                # Exponential back-off
                $delay = [math]::min($delay * 1.5, 300)
            } elseif ($_.Exception.Response.StatusCode -eq 400) {
                if ($docErrors.file -notcontains $doc.file) {
                    $docErrors += [ordered]@{
                        error   = $_.exception.ErrorDetails.Message | ForEach-Object error | ForEach-Object message
                        file    = $doc.file
                        title   = $doc.title
                    }
                }
            } else {
                throw
            }
        }
    } while ($retryCount -lt $maxRetries)
}
if (0 -lt $docErrors.count) {
    Write-Host "$($docErrors.count) documents encountered known errors such as too many tokens.`nReview the `$docErrors variable for details."
}
```

You now have a local in-memory database table of PowerShell 7.4 reference docs.

Based on a search string, we need to calculate another set of vectors so PowerShell can rank each
document by similarity.

In the next example, vectors are retrieved for the search string `get a list of running processes`.

```powershell-interactive
$searchText = "get a list of running processes"

$body = [ordered]@{
    input = $searchText
} | ConvertTo-Json

$url = "$($openai.api_base)/openai/deployments/$($openai.name)/embeddings?api-version=$($openai.api_version)"

$params = @{
    Uri         = $url
    Headers     = $headers
    Body        = $body
    Method      = 'Post'
    ContentType = 'application/json'
}
$response = Invoke-RestMethod @params
$searchVectors = $response.data.embedding -join ','
```

Finally, the next sample function, which borrows an example from the example script
[Measure-VectorSimilarity][12] written by Lee Holmes, performs a **cosine similarity** calculation
and then ranks each row in the datatable.

```powershell-interactive
# Sample function to calculate cosine similarity
function Get-CosineSimilarity ([float[]]$vector1, [float[]]$vector2) {
    $dot = 0
    $mag1 = 0
    $mag2 = 0

    $allkeys = 0..($vector1.Length-1)

    foreach ($key in $allkeys) {
        $dot  += $vector1[$key]  * $vector2[$key]
        $mag1 += ($vector1[$key] * $vector1[$key])
        $mag2 += ($vector2[$key] * $vector2[$key])
    }

    $mag1 = [Math]::Sqrt($mag1)
    $mag2 = [Math]::Sqrt($mag2)

    return [Math]::Round($dot / ($mag1 * $mag2), 3)
}
```

The commands in the next example loop through all rows in `$Datatable` and calculate the cosine
similarity to the search string. The results are sorted and the top three results are stored in a
variable named `$topThree`. The example does not return output.

```powershell-interactive
# Calculate cosine similarity for each row and select the top 3
$topThree = $Datatable | ForEach-Object {
    [PSCustomObject]@{
        title = $_.title
        similarity = Get-CosineSimilarity $_.vectors.split(',') $searchVectors.split(',')
    }
} | Sort-Object -property similarity -descending | Select-Object -First 3 | ForEach-Object {
    $title = $_.title
    $Datatable | Where-Object { $_.title -eq $title }
}
```

Review the output of the `$topThree` variable, with only **title** and **url** properties, in
gridview.

```powershell
$topThree | Select "title", "uri" | Out-GridView
```

**Output:**

:::image type="content" source="../media/tutorials/query-result-PowerShell.png" alt-text="Screenshot of the formatted results once the search query finishes." lightbox="../media/tutorials/query-result-PowerShell.png":::

The `$topThree` variable contains all the information from the rows in the datatable. For example,
the **content** property contains the original document format. Use `[0]` to index into the first item
in the array.

```powershell-interactive
$topThree[0].content
```

View the full document (truncated in the output snippet for this page).

```Output
---
external help file: Microsoft.PowerShell.Commands.Management.dll-Help.xml
Locale: en-US
Module Name: Microsoft.PowerShell.Management
ms.date: 07/03/2023
online version: https://learn.microsoft.com/powershell/module/microsoft.powershell.management/get-process?view=powershell-7.4&WT.mc_id=ps-gethelp
schema: 2.0.0
title: Get-Process
---

# Get-Process

## SYNOPSIS
Gets the processes that are running on the local computer.

## SYNTAX

### Name (Default)

Get-Process [[-Name] <String[]>] [-Module] [-FileVersionInfo] [<CommonParameters>]
# truncated example
```

Finally, rather than regenerate the embeddings every time you need to query the dataset, you can
store the data to disk and recall it in the future. The `WriteXML()` and `ReadXML()` methods of
**DataTable** object types in the next example simplify the process. The schema of the XML file
requires the datatable to have a **TableName**.

Replace `<YOUR-FULL-FILE-PATH>` with the full path where you would like to write and read the XML
file. The path should end with `.xml`.

```powershell-interactive
# Set DataTable name
$Datatable.TableName = "MyDataTable"

# Writing DataTable to XML
$Datatable.WriteXml("<YOUR-FULL-FILE-PATH>", [System.Data.XmlWriteMode]::WriteSchema)

# Reading XML back to DataTable
$newDatatable = New-Object System.Data.DataTable
$newDatatable.ReadXml("<YOUR-FULL-FILE-PATH>")
```

As you reuse the data, you need to get the vectors of each new search string (but not
the entire datatable). As a learning exercise, try creating a PowerShell script to automate the
`Invoke-RestMethod` command with the search string as a parameter.

<!-- Reference link definitions -->
[01]: https://azure.microsoft.com/free/cognitive-services?azure-portal=true

[03]: ../concepts/models.md#model-summary-table-and-region-availability
[04]: ../how-to/create-resource.md
[05]: https://aka.ms/install-powershell
[06]: /powershell/module/?view=powershell-7.4&preserve-view=true
[07]: https://www.microsoft.com/research/tools/
[08]: /dotnet/framework/data/adonet/dataset-datatable-dataview/defining-primary-keys
[09]: ../concepts/understand-embeddings.md#cosine-similarity
[10]: /azure/search/vector-search-overview
[11]: https://platform.openai.com/docs/guides/rate-limits/error-mitigation
[12]: https://www.powershellgallery.com/packages/Measure-VectorSimilarity/
