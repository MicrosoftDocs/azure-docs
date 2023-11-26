---
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/06/2023
author: mrbullwinkle #noabenefraim
ms.author: mbullwin
---
* [PowerShell 7.4](https://aka.ms/install-powershell)>

Make sure your Azure OpenAI deployment includes the model, **text-embedding-ada-002**, or [deploy the model](../how-to/create-resource.md#deploy-a-model) before proceeding.

> [!NOTE]
> Many examples in this tutorial re-use variables from step-to-step. Keep the same terminal session
open throughout, or you must to begin again from the start.

[!INCLUDE [get-key-endpoint](../includes/get-key-endpoint.md)]


Create and assign persistent environment variables for your key and endpoint.

### Environment variables

# [PowerShell](#tab/powershell)

```powershell-interactive
$Env:AZURE_OPENAI_KEY = 'YOUR_KEY_VALUE'
```

```powershell-interactive
$Env:AZURE_OPENAI_ENDPOINT = 'YOUR_ENDPOINT'
```

# [Bash](#tab/bash)

```Bash
echo export AZURE_OPENAI_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=OVERVIEW&Pillar=AOAI&Product=embedding&Page=tutorial&Section=Prerequisites)

For this tutorial, we use the [PowerShell 7.4 reference documentation](/powershell/module/?view=powershell-7.4&preserve-view=true) as a well-known and safe sample dataset. As an alternative, you might
choose to explore the [Microsoft Research tools](https://www.microsoft.com/research/tools/)
sample datasets.

Create a folder where you would like to store your project. Set your location to the project folder. Download the dataset to your local machine using the
`Invoke-WebRequest` command and then expand the archive. Last, set your location to the subfolder
containing reference information for PowerShell version 7.4.

```powershell-interactive
Invoke-WebRequest https://github.com/MicrosoftDocs/PowerShell-Docs/archive/refs/heads/main.zip -OutFile .\PSDocs.zip
Expand-Archive FILE-PATH-TO-YOUR-PROJECT\PSDocs.zip
Set-Location FILE-PATH-TO-YOUR-PROJECT\PSDocs\PowerShell-Docs-main\reference\7.4\
```

We are working with a large amount of data in this tutorial, so we use a .NET data table
object for efficient performance. The datatable has columns *title*, *content*,*prep*, 
*uri*, *tokens*, and *vectors*. The *title* column is the [primary key](/dotnet/framework/data/adonet/dataset-datatable-dataview/defining-primary-keys).

In the next step, we load the content of each markdown file into the data table. We also use PowerShell `-match` operator to capture known lines of text "title: " and "online version: ", and store them in distinct columns. Some of the files don't contain
the metadata lines of text, but since they're overview pages and not detailed reference docs, we exclude them from the datatable.

```powershell-interactive
# make sure your location is the project subfolder

$Datatable = New-Object System.Data.DataTable

'title','content','prep','uri','tokens','vectors' | ForEach-Object {
    $datatable.columns.add($_)
} | Out-Null
$datatable.primarykey = $datatable.columns['title']

$md = Get-ChildItem -Path .\ -Include *.md -Recurse

$md | ForEach-Object {
    $content    = get-content $_.fullname
    $title      = $content | Where-Object { $_ -match 'title: ' }
    $uri        = $content | Where-Object {$_ -match 'online version: '}
    if ($title -and $uri) {
        $row                = $Datatable.newrow()
        $row.title          = $title.tostring().replace('title: ','')
        $row.content        = $content | out-string
        $row.content        = '' # use later in the tutorial
        $row.uri            = $uri.tostring().replace('online version: ','')
        $row.vectors        = '' # use later in the tutorial
        $Datatable.rows.add($row)
    }
}
```

View the data using the `out-gridview` command.

```powershell-interactive
$datatable | out-gridview
```

Output:

:::image type="content" source="../media/tutorials/initial-datatable.png" alt-text="Screenshot of the initial DataTable results." lightbox="../media/tutorials/initial-datatable.png":::

Next perform some light data cleaning by removing extra characters, empty space, and other document
notations, to prepare the data for tokenization. The sample function `Invoke-DocPrep` demonstrates
how to use the PowerShell `-replace` operator to iterate through a list of characters you would like
to remove from the content.

```powershell-interactive
# sample demonstrates how to use "-replace" to remove characters from text content
function Invoke-DocPrep {
param(
    [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
    [string]$content
)
    # tab, line breaks, empty space
    $replace = @('\t','\r\n','\n','\r','  ')
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
        $content = $content -replace $_, ''
    }
    return $content
}
```

After you create the `invoke-docprep` function, use the `ForEach-Object` command to store prepared
content in the "prep" column, for all rows in the datatable. We are using a new column so the
original formatting is available if we would like to retrieve it later.

```powershell-interactive
$dataset.rows | ForEach-Object {$_.prep = Invoke-DocPrep $_.content}
```

View the datatable again to see the change.

```powershell-interactive
$datatable | out-gridview
```

Next, we estimate the number of tokens per document and populate the "tokens" column.

> [!IMPORTANT]
> If you are estimating tokens for any purpose related to billing, make sure to use a solution officially recommended by OpenAI, such as the [TikToken](https://github.com/openai/tiktoken) package for Python. The official approach could change without updates to this document. See the OpenAI [Tokenizer](https://platform.openai.com/tokenizer) site for details.

To estimate token count for each document, we use the unsupported C# package
"Microsoft.DeepDev.Tokenizer".

From the project website:

```text
This repo contains C# and Typescript implementation of byte pair encoding(BPE)tokenizer for
OpenAI LLMs, it's based on open sourced rust implementation in the OpenAI tiktoken.Both
implementation are valuable to run prompt tokenization in .NET and Nodejs environmentbefore
feeding prompt into a LLM.
```

For details about the Tokenizer project development or to submit issues/feedback
to the community, visit the [Tokenizer GitHub project](https://github.com/microsoft/Tokenizer/).

For this tutorial, the intention
is to use the estimated token count only as a filter for excluding large documents before upload.

To install the library assembly, we register [NuGet.org](https://nuget.org) as a repository in
PSResourceGet, [following the documentation](/powershell/gallery/powershellget/supported-repositories?view=powershellget-2.x#nugetorg&preserve-view=true).

```powershell-interactive
$params = @{
    Name = 'NuGetGallery'
    Uri  = 'https://api.nuget.org/v3/index.json'
}
Register-PSResourceRepository @params
```

Next, install the "Microsoft.DeepDev.Tokenizerlib' package.

```powershell-interactive
$params = @{
    name        = 'Microsoft.DeepDev.TokenizerLib'
    repository  = 'NuGetGallery'
}
Install-PSResource @params
# after running the command, you is prompted to accept installing from a public repository
```

Then, if you prefer not to leave the repository registered, unregister it.

```powershell-interactive
Unregister-PSResourceRepository -Name 'NuGetGallery'
```

Look up the install location of the DLL file using the `Get-PSResource` command.

```powershell-interactive
$pathToTokenizerlibDll = Get-PSResource -Name 'Microsoft.DeepDev.TokenizerLib' | ForEach-Object InstalledLocation
```

The full path to the file is the installed location plus the folder structure. The folder
names will change as new versions ar released.

```powershell-interactive
# for package version 1.3.2
$pathToTokenizerlibDll = Join-Path $pathToTokenizerlibDll '/Microsoft.DeepDev.TokenizerLib/1.3.2/lib/netstandard2.0/Microsoft.DeepDev.TokenizerLib.dll'
```

Finally, create the sample function `Get-BPETokenCount` to estimate tokens for filtering large
documents. Expect the sample function to run for a few minutes, or more, depending on your dataset.

```powershell-interactive
# sample demonstrates using the "Tokenizer" library to estimate document token count
function Get-BPETokenCount {
param (
    [Parameter(Mandatory = $true, ValueFromPipelineByPropertyName = $true)]
    [string]$text,
    [Parameter(Mandatory = $true, ValueFromPipelineByPropertyName = $true)]
    [string]$pathToTokenizerlibDll
    [string]$modelName = 'text-embedding-ada-002',
    [hashtable]$specialTokens = @{} # for chat models, this value would include IM_START and IM_END
)

    Import-Module $pathToTokenizerlibDll

    $specialTokensDictionary = [System.Collections.Generic.Dictionary[string, int]]::new()
    foreach ($key in $specialTokens.Keys) {
        $specialTokensDictionary.Add($key, $specialTokens[$key])
    }

    $tokenizer = [Microsoft.DeepDev.TokenizerBuilder]::CreateByModelNameAsync($modelName, $specialTokensDictionary).Result
    $encoded = $tokenizer.Encode($text, [System.Collections.Generic.HashSet[string]]@($specialTokens.Keys))
    
    return [int]$encoded.count
}
```

Run the sample function to set the "tokens" value for each row in the datatable.

```powershell-interactive
$datatable.rows | ForEach-Object {
    $params = @{
        content = $_.content
        pathToTokenizerlibDll = $pathToTokenizerlibDll
    }
    $_.tokens = Get-BPETokenCount @params
}
```

Now we can create a view of the datatable, called a
[dataview](/dotnet/framework/data/adonet/dataset-datatable-dataview/dataviews),
that filters any rows where the token count is greater than 8192.

```powershell-interactive
$dataview   = New-Object System.Data.DataView($datatable)
$dataview.RowFilter = "tokens <= 8192"
```

Compare the original data to the filtered view, to check how many files are excluded.

```powershell-interactive
$datatable.rows.count
$dataview.count
```

Nine documents are excluded from the dataview because they're larger than 8192 tokens.

```output
446
437
```

When we pass the documents to the embeddings model, it encodes the documents into tokens similar
(though not identical) to the `Microsoft.DeepDev.Tokenizerlib` sample and then return a series of floating
point numbers to use in a [cosine similarity](../concepts/understand-embeddings.md#cosine-similarity) search. These embeddings can be stored locally or
in a service such as [Vector Search in Azure AI Search](/azure/search/vector-search-overview). Each
document has its own corresponding embedding vector in the new `vectors` column.

The next example loops through each row in the datatable, retrieves the vectors for the preprocessed content, and stores them to the "vectors" column. The OpenAI service throttles frequent requests, so the example includes an **exponential back-off** as suggested by the [documentation](https://platform.openai.com/docs/guides/rate-limits/error-mitigation).

After the script completes, each row should have a comma-delimited list of 1536 vectors for each document.

```powershell-interactive
# Azure OpenAI metadata variables
$openai = @{
    api_key     = $Env:AZURE_OPENAI_KEY
    api_base    = $Env:AZURE_OPENAI_ENDPOINT # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    api_version = '2023-05-15' # this may change in the future
    name        = 'YOUR-DEPLOYMENT-NAME-HERE' # Corresponds to the custom name you chose for your deployment when you deployed a model.
}

$headers = [ordered]@{
    'api-key' = $openai.api_key
}

$dataview | ForEach-Object {
    $doc = $_

    $body = [ordered]@{
        input = $doc.prep
    } | ConvertTo-Json
    
    $url = "$($openai.api_base)/openai/deployments/$($openai.name)/embeddings?api-version=$($openai.api_version)
    
    $retryCount = 0
    $maxRetries = 10
    $delay = 1
    
    do {
        try {
            $response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
            $datatable.rows.find($doc.title).vectors = ($response.data.embedding -join ',') | Out-String
            break
        } catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                $retryCount++
                [int]$retryAfter = $_.Exception.Response.Headers | Where-Object key -eq 'Retry-After' | ForEach-Object value
                if ($delay -lt $retryAfter) { $delay = $retryAfter++ } # Use delay from error header
                Start-Sleep -Seconds $delay
                $delay = [math]::min($delay * 1.5, 300)  # Exponential back-off
            } else {
                throw
            }
        }
    } while ($retryCount -lt $maxRetries)
}
```

You now have a local in-memory database of PowerShell 7.4 reference docs.

Based on a search string, we need to calculate another set of vectors so PowerShell can rank each document by similarity. In the next example, vectors are retrieved for the string "get a list of running processes".


```powershell-interactive
$searchText = "get a list of running processes"

$body = [ordered]@{
    input = $searchText
} | ConvertTo-Json

$url = "$($openai.api_base)/openai/deployments/$($openai.name)/embeddings?api-version=$($openai.api_version)"

$response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
$searchVectors = $response.data.embedding -join ','
```

Finally, the next sample function, which borrows an example from Lee Holmes' [Measure-VectorSimilarity](https://www.powershellgallery.com/packages/Measure-VectorSimilarity/) script, performs a **cosine similarity** calculation and then ranks each row in the dataview. The *title* and *uri* of the top three most similar rows are returned.

```powershell-interactive
# Sample function to calculate cosine similarity
function Get-CosineSimilarity ([float[]]$vector1, [float[]]$vector2) {
    $dot = 0
    $mag1 = 0
    $mag2 = 0

    $allkeys = 0..($vector1.Length-1)

    foreach ($key in $allkeys) {
        $dot += $vector1[$key] * $vector2[$key]
        $mag1 += ($vector1[$key] * $vector1[$key])
        $mag2 += ($vector2[$key] * $vector2[$key])
    }

    $mag1 = [Math]::Sqrt($mag1)
    $mag2 = [Math]::Sqrt($mag2)

    return [Math]::Round($dot / ($mag1 * $mag2), 3)
}

# Calculate cosine similarity for each row and select the top 3
$topThree = $dataview | ForEach-Object {
    [PSCustomObject]@{
        title = $_.title
        similarity = Get-CosineSimilarity $_.vectors.split(',') $searchVectors.split(',')
    }
} | Sort-Object -property similarity -descending | Select-Object -First 3 | ForEach-Object {
    $title = $_.title
    $dataview | Where-Object { $_.title -eq $title }
}

$topThree | Select "title", "uri"
```

As a learning exercise, add the "content" column to the `Select` (alias for `Select-Object`) command in the last line of the example, to view the full text of each document.

**Output:**

:::image type="content" source="../media/tutorials/query-result-powershell.png" alt-text="Screenshot of the formatted results once the search query finishes." lightbox="../media/tutorials/query-result-powershell.png":::

Finally, rather than regenerate the embeddings every time you need to query the dataset, you can
store the data to disk and recall it in the future. The `WriteXML` and `ReadXML` methods of
datatable object types in the example below simplify the process. The schema of the XML file
requires the datatable to have a "TableName". Replace "YOUR-FULL-FILE-PATH" with the full path
where you would like to write and read the XML file.

```powershell-interactive
# Set DataTable name
$datatable.TableName = "MyDataTable"

# Writing DataTable to XML
$datatable.WriteXml("YOUR-FULL-FILE-PATH.xml", [System.Data.XmlWriteMode]::WriteSchema)

# Reading XML back to DataTable
$newDatatable = New-Object System.Data.DataTable
$newDatatable.ReadXml("YOUR-FULL-FILE-PATH.xml")
```

As you reuse the data, you need to get the vectors of each new search string (but not
the entire datatable). As a learning exercise, try creating a PowerShell script to automate the
`Invoke-RestMethod` command with the search string as a parameter.
