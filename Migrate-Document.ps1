#============================================================================================================================
# Usage: .\Migrate-Document.ps1 -InputFile "{relative-path-to-markdown-document}" [-OutputFileName "{new-name-for-article}"]
#============================================================================================================================


Param (
        [Parameter(Mandatory = $true)] 
        [string] $InputFile,        

        [string] $OutputFileName,
		
		[string] $AutoAcceptConsent = $false
)


#=========================
# Definition of functions
#=========================


function Report-Output
(
    [string] $Type = 'Status',
    
    [string] $Message    
)
{
    if ($Type -eq 'Status'){ Write-Host "$Message`r" }
            
    if ($Type -eq 'Warning'){ Write-Warning "$Message`r" }

    if ($Type -eq 'Error'){ Write-Error "$Message`r" }
}


function ToMDFileFormat($fileName)
{
    if ($fileName -eq "" -OR $fileName -eq $null)
    {
        return ""
    }
    
    return $fileName.Replace(".md", "") + ".md"     
}


function PromptYesNo([string]$message, [string]$caption)
{
    $yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes",""
    $no = New-Object System.Management.Automation.Host.ChoiceDescription "&No",""
    $choices = [System.Management.Automation.Host.ChoiceDescription[]]($yes,$no)
    
    $result = $Host.UI.PromptForChoice($caption,$message,$choices,0)
    return $result
}



function RemoveUnusedReferences([string]$DocumentFullPath)
{
    # Definition of RegEx to use to obtain images from the Markdown file
    $ImageInlineRegex = '!\[(?<imageReferenceLabel>.*?)\]\s*\[(?<imageReferenceInDoc>\S*)\]'
    $ReferenceRegex = '\[\s*(?<reference>\S+)\s*\]\s*:\s*(?<imageRelativePath>\S+)\s*(\".*?\")?'

    # Definition of regex used for Markdown links
    $LinksReferenceRegex = '(?<!!)\[(?<linkReferenceLabel>.*?)\]\s*\[(?<linkReferenceInDoc>\S*?)\]'

    # Retrieve all links references
    $LinkReferences = Select-String -Path $DocumentFullPath -Pattern $LinksReferenceRegex | ForEach-Object {$_.Matches}

    # Retrieve all image references
    $ImageReferences = Select-String -Path $DocumentFullPath -Pattern $ImageInlineRegex | ForEach-Object {$_.Matches}

    # Retieve all references (both links and images)
    $References = Select-String -Path $DocumentFullPath -Pattern $ReferenceRegex | ForEach-Object {$_.Matches}

    # Get the document content
    $localEncoding = Get-FileEncoding $DocumentFullPath
    $Doc = Get-Content -Path $DocumentFullPath -Encoding $localEncoding

    Foreach ($Reference in $References)
    {
        $ContainsLinkReference = $false
        $ContainsImageReference = $false

        if ($LinkReferences.Count -gt 0)
        {
            Foreach ($LinkReference in $LinkReferences)
            {
                if ($LinkReference.Groups["linkReferenceInDoc"].Value -eq $Reference.Groups["reference"].Value)
                {
                    $ContainsLinkReference = $true
                    break
                }
            }
        }

        if ($ImageReferences.Count -gt 0)
        {
            Foreach ($ImageReference in $ImageReferences)
            {
                if ($ImageReference.Groups["imageReferenceInDoc"].Value -eq $Reference.Groups["reference"].Value)
                {
                    $ContainsImageReference = $true
                    break
                }
            }
        }

        if ((-NOT $ContainsLinkReference) -AND (-NOT $ContainsImageReference))
        {
            $Doc = $Doc -replace [regex]::Escape($Reference), ""
        }
    }

    # Set updated document content
    Set-Content $DocumentFullPath $Doc -Encoding $localEncoding
}


function ProcessImages([string]$NewMovedFile, [string]$DocumentMediaFolder, [string]$MediaFolderRelativePath, $OldDocumentDirectory)
{
    # Set target asset (article or include) to be used for logging purposes
    $TargetAsset = "include"

    if ((Split-Path (Split-Path $NewMovedFile -parent) -Leaf) -eq "articles")
    {
        $TargetAsset = "article"
    }

    $DocName = Split-Path $DocumentMediaFolder -Leaf

    # Definition of RegEx to use to obtain images from the Markdown file
    $ImageInlineRegex = '!\[(?<imageReferenceLabel>.*?)\]\s*(\[(?<imageReferenceInDoc>\S*)\]|\((\s*(?<imageRelativePath>\S+?)\s*(\".*?\")?)\))'
    $ImageReferenceRegex = '\[\s*(?<imageReference>\S+)\s*\]\s*:\s*(?<imageRelativePath>\S+)\s*(\".*?\")?'

    # Initialize dictionary containing key = OldImageUrl and value = NewImageUrl
    $ImageUrisDictionary = @{}

    # Initialize dictionary containing key = OldImageRef and value = NewImageRef
    $ImgRefsDictionary = @{}

    # Retrieve all of the inline-pattern image uris
    $ImagesInlineUris = Select-String -Path $NewMovedFile -Pattern $ImageInlineRegex | ForEach-Object {$_.Matches} | ForEach-Object {$_.groups["imageRelativePath"]} | Where-Object {$_.Success -eq $true}

    Foreach ($ImagesInlineUri in $ImagesInlineUris)
    {
        [uri]$uri = $null

        if (-NOT([Uri]::TryCreate($ImagesInlineUri.Value, [UriKind]::Absolute, [ref]$uri)) )
        {
            $OldImageFullPath = Join-path $OldDocumentDirectory $ImagesInlineUri.Value
            $ImageName = ([io.fileinfo]$OldImageFullPath).Name
            $NewImageRelativePath = Join-Path $MediaFolderRelativePath $ImageName

            # If image uri is not absolute, save the old image url and the new image url in a dictionary for post-processing (checking that it was not already added)
            if (!$ImageUrisDictionary.ContainsKey($ImagesInlineUri.Value))
            {            
                $ImageUrisDictionary.Add($ImagesInlineUri.Value, $NewImageRelativePath.Replace("\", "/"))             
            }
        }
    }

    # Retrieve all of the referenced-pattern image uris
    $ImagesReferences = Select-String -Path $NewMovedFile -Pattern $ImageInlineRegex | ForEach-Object {$_.Matches}

    Foreach ($ImageReference in $ImagesReferences | Where-Object {$_.Groups["imageRelativePath"].Value -eq ""})
    {
        $ImageReferenceInDoc = $ImageReference.Groups["imageReferenceInDoc"].Value
        $ImageReferenceLabel = $ImageReference.Groups["imageReferenceLabel"].Value

        # If there is no reference to the image, don't process it
        if (($ImageReferenceInDoc -ne "") -OR ($ImageReferenceLabel -ne ""))
        {
            # Get image reference from regex
            $ImageRef = $ImageReferenceInDoc

            if ($ImageReferenceInDoc -eq "")
            {
                $ImageRef = $ImageReferenceLabel

                if (!$ImgRefsDictionary.ContainsKey($ImageReference.Value))
				{
					# copy image label as image reference
					$NewImgRef = $ImageReference.Value -replace [regex]::Escape("[]"), "[$ImageReferenceLabel]"
					$ImgRefsDictionary.Add($ImageReference.Value, $NewImgRef)
				}
            }

            # Search for the image reference in the markdown document
            $matchesValues = Select-String -Path $NewMovedFile -Pattern $ImageReferenceRegex | ForEach-Object {$_.Matches}

            Foreach ($matchvalue in $matchesValues)
            {
                # For each match value, check if the reference exist in the document, and retrieve the uri
                if ($ImageRef -eq $matchvalue.Groups["imageReference"].Value)
                {
                    $ImageToCopy = $matchValue.Groups["imageRelativePath"].Value
                    break
                }
            }

            if ($ImageToCopy -ne $null -AND $ImageToCopy -ne "")
            {
                [uri]$uri = $null

                if (-NOT([Uri]::TryCreate($ImageToCopy, [UriKind]::Absolute, [ref]$uri)) )
                {
                    $OldImageFullPath = Join-path $OldDocumentDirectory $ImageToCopy
                    $ImageName = ([io.fileinfo]$OldImageFullPath).Name
                    $NewImageRelativePath = Join-Path $MediaFolderRelativePath $ImageName

                    # Save the old image url and the new image url in a dictionary for post-processing (checking that it was not already added)
                    if (!$ImageUrisDictionary.ContainsKey($ImageToCopy))
                    { 
                        $ImageUrisDictionary.Add($ImageToCopy, $NewImageRelativePath.Replace("\", "/"))
                    }
                }
                else
                {
                    Report-Output -Message "An image with absolute path $ImageToCopy was found. Skipping it from copy..."
                }    
            }
            else
            {
                Report-Output -Message "INFORMATION: Ignoring image with reference '$ImageRef' because it wasn't found anywhere in the $TargetAsset"
            }        
        
        }
    }


    if ($ImageUrisDictionary.Count -gt 0)
    {
        if ($TargetAsset -eq "article")
        {
            # Check if ArticlesMediaFolder already exists. If not, create it
            if(!(Test-Path -Path $ArticlesMediaFolder )){
                New-Item -ItemType directory -Path $ArticlesMediaFolder | Out-Null # ignore the default output of new-item cmdlet
	            Report-Output -Message "Directory created for the article's media at $ArticlesMediaFolder"
            }

            # Check if document media folder already exists. If not, create it
            if(!(Test-Path -Path $DocumentMediaFolder )){
                New-Item -ItemType directory -Path $DocumentMediaFolder | Out-Null # ignore the default output of new-item cmdlet
                Report-Output -Message "Directory created for media folder of article $DocName at $DocumentMediaFolder"
            }
        }

        if ($TargetAsset -eq "include")
        {
            # Check if IncludesMediaFolder already exists. If not, create it
            if(!(Test-Path -Path $IncludesMediaFolder )){
                New-Item -ItemType directory -Path $IncludesMediaFolder | Out-Null # ignore the default output of new-item cmdlet
	            Report-Output -Message "Directory created for Includes' media at $IncludesMediaFolder"
            }

            # Check if document media folder already exists. If not, create it
            if(!(Test-Path -Path $DocumentMediaFolder )){
                New-Item -ItemType directory -Path $DocumentMediaFolder | Out-Null # ignore the default output of new-item cmdlet
                Report-Output -Message "Directory created for media folder of include $DocName at $DocumentMediaFolder"
            }
        }
    }

    $localEncoding = Get-FileEncoding $NewMovedFile
    $Document = Get-Content $NewMovedFile -Encoding $localEncoding
    
    $DocName = ([io.fileinfo]$NewMovedFile).Name
       
    # Loop the image uris list to check if they are valid, and in that case, copy the image to the destination media folder for the document
    Foreach ($key in $($ImageUrisDictionary.keys))
    {
        $ImageUriPath = Join-Path $OldDocumentDirectory $key

        if (Test-Path -Path $ImageUriPath){
            # The image uri is valid, proceed and copy it to the destination folder
            Copy-Item $ImageUriPath -Destination $DocumentMediaFolder

            $NewImageFullPath = Join-Path $DocumentMediaFolder ([io.fileinfo]$ImageUriPath).Name
			Report-Output -Message "Image for $TargetAsset $DocName was copied to $NewImageFullPath"
			
            # Update document with new image uri
            $Document = $Document -replace [regex]::Escape($key), $ImageUrisDictionary[$key]
        }
        else
        {
            Report-Output -Type "Warning" -Message "Image for $TargetAsset couldn't be found at $ImageUriPath"
        }
    }

    # Update image references
    Foreach ($key in $($ImgRefsDictionary.keys))
    {
        $Document = $Document -replace [regex]::Escape($key), $ImgRefsDictionary[$key]
    }

	# Clear dictionary used for image uris and image references
	$ImageUrisDictionary.Clear()
    $ImgRefsDictionary.Clear()
	
    return $Document
}

function Get-FileEncoding {
    param ( [string] $FilePath )

    [byte[]] $byte = get-content -Encoding byte -ReadCount 4 -TotalCount 4 -Path $FilePath

    if ( $byte[0] -eq 0xef -and $byte[1] -eq 0xbb -and $byte[2] -eq 0xbf )
        { $encoding = 'UTF8' }  
    elseif ($byte[0] -eq 0xfe -and $byte[1] -eq 0xff)
        { $encoding = 'BigEndianUnicode' }
    elseif ($byte[0] -eq 0xff -and $byte[1] -eq 0xfe)
         { $encoding = 'Unicode' }
    elseif ($byte[0] -eq 0 -and $byte[1] -eq 0 -and $byte[2] -eq 0xfe -and $byte[3] -eq 0xff)
        { $encoding = 'UTF32' }
    elseif ($byte[0] -eq 0x2b -and $byte[1] -eq 0x2f -and $byte[2] -eq 0x76)
        { $encoding = 'UTF7'}
    else
        { $encoding = 'ASCII' }
    return $encoding
}


#===============================================================
# Check if script is being run from the root folder of the repo
#===============================================================

if ($AutoAcceptConsent -ne $true)
{
    $caption = "Location confirmation"
    $message = "This script is intended to be executed within the root of the azure-content repository. Choose YES if you want to proceed, otherwise choose NO to exit."
    $result = PromptYesNo $message $caption

    if ($result -eq 1)
    {
        # Answer NO - Return from script execution
		return
    }
}


#==============================
# Definition of base variables
#==============================

[string] $ArticlesFolder = ".\articles"

[string] $ArticlesMediaFolder = ".\articles\media"

[string] $IncludesFolder = ".\includes"

[string] $IncludesMediaFolder = ".\includes\media"


#==========================================================
# Resolve relative paths for articles and includes folders
#==========================================================


# Check if InputFile exists. If not, exit
if(!(Test-Path -Path $InputFile )){
    Write-Error "The input file $InputFile does not exist. Exiting..."
    return
}


# Set current script location
$ScriptDir = (Split-Path $myinvocation.mycommand.path -parent)
Set-Location $ScriptDir

# If InputFile is not absolute, join it with current script location
if(-not (Split-Path $InputFile -IsAbsolute)){
    $InputFile = Join-Path "$ScriptDir" "$InputFile"
}


# If ArticlesFolder is not absolute, join it with current script location
if(-not (Split-Path $ArticlesFolder -IsAbsolute)){
    $ArticlesFolder = Join-Path "$ScriptDir" "$ArticlesFolder"
}


# If ArticlesMediaFolder is not absolute, join it with current script location
if(-not (Split-Path $ArticlesMediaFolder -IsAbsolute)){
    $ArticlesMediaFolder = Join-Path "$ScriptDir" "$ArticlesMediaFolder"
}


# If includesFolder is not absolute, join it with current script location
if(-not (Split-Path $IncludesFolder -IsAbsolute)){
    $IncludesFolder = Join-Path "$ScriptDir" "$IncludesFolder"
}


# If IncludesMediaFolder is not absolute, join it with current script location
if(-not (Split-Path $IncludesMediaFolder -IsAbsolute)){
    $IncludesMediaFolder = Join-Path "$ScriptDir" "$IncludesMediaFolder"
}



# Obtain input file name
$InputFileName = ([io.fileinfo]$InputFile).Name

# Obtain directory of input file name
$InputFileDirectory = ([io.fileinfo]$InputFile).Directory


#=====================================================
# Set new output file name if provided in the console
#=====================================================

# If OutputFileName has value, rename the InputFile
if ($OutputFileName -ne $null -AND $OutputFileName -ne "")
{
    $OutputFileName = ToMDFileFormat($OutputFileName)
    Rename-Item $InputFile "$OutputFileName"
    $NewInputFile = $InputFile.Replace($InputFileName, $OutputFileName)
    $InputFile = $NewInputFile
    $InputFileName = $OutputFileName

    Report-Output -Message "Output file name received from console. Updating article name to $InputFileName..."
}


#=======================================================
# Check for duplicated document name in articles folder
#=======================================================

# Check for duplicated document name in articles folder, and prompt the user to insert a new one if necessary
if (Test-Path -Path (Join-Path $ArticlesFolder $InputFileName))
{
    $ParentDirectory = $InputFile
    $NewFileName = $InputFileName

    while (($NewFileName -eq "") -OR ($NewFileName -eq $null) -OR (Test-Path -Path (Join-Path $ArticlesFolder $NewFileName)))
    {        
    	$ParentDirectory = [io.fileinfo](Split-path $ParentDirectory -parent)
     
        if ($NewFileName -eq "")
        {
            [System.Reflection.Assembly]::LoadWithPartialName('Microsoft.VisualBasic') | Out-Null # ignore the default output
            $NewFileName = [Microsoft.VisualBasic.Interaction]::InputBox("Document name cannot be blank. Please insert a new document name:", "Warning", $ParentDirectory.Name + "-" + $NewFileName)
        }
        else
        {
            [System.Reflection.Assembly]::LoadWithPartialName('Microsoft.VisualBasic') | Out-Null # ignore the default output
            $NewFileName = [Microsoft.VisualBasic.Interaction]::InputBox("There is already a document named $NewFileName in $ArticlesFolder. Please insert a new document name:", "Warning", $ParentDirectory.Name + "-" + $NewFileName)
        }

        $NewFileName = ToMDFileFormat($NewFileName)
    }
    
    $NewFileName = ToMDFileFormat($NewFileName)
    Rename-Item $InputFile $NewFileName
    $NewInputFile = $InputFile.Replace($InputFileName, $NewFileName)
    $InputFile = $NewInputFile
    $InputFileName = $NewFileName
	
	Report-Output -Message "Updated article name to $InputFileName"
}


# Check if articles folder already exists. If not, create it
if(!(Test-Path -Path $ArticlesFolder )){
    New-Item -ItemType directory -Path $ArticlesFolder | Out-Null # ignore the default output of new-item cmdlet
}


# Start transcript for logging
$ErrorActionPreference="SilentlyContinue"
Stop-Transcript | out-null
$ErrorActionPreference = "Continue"

$NewLogName = ([io.fileinfo]$InputFileName).BaseName + "-migration.log"
$OutputFileLocation = Join-Path $ArticlesFolder $NewLogName
Start-Transcript -path $OutputFileLocation -append

Report-Output -Message ""
Report-Output -Message "Starting the migration process to the new folder structure for $InputFile"
Report-Output -Message "Directory created for the article at $ArticlesFolder"


#==============================
# Resolve article media folder
#==============================

# Obtain input file base name to use as document media folder name
$InputFileBaseName = ([io.fileinfo]$InputFile).BaseName


# Obtain document media folder name
$DocumentMediaFolder = Join-Path $ArticlesMediaFolder $InputFileBaseName



$ArticlesMediaFolderRelativePath = Join-Path ".\media" $InputFileBaseName


#=======================================
# Move input article to articles folder
#=======================================

# Move InputFile to Articles folder
Move-Item $InputFile $ArticlesFolder
Report-Output -Message "Article was moved to $ArticlesFolder"


$NewMovedFile = Join-Path $ArticlesFolder $InputFileName

#===========================
# Process images in article
#===========================

# Definition of <img> HTML syntax regex
$ImgHtmlTagsRegex = '<img\s+(.*)src=\"(?<imgRelativePath>.+?)\"(.*)(/>|>(.*)</img>)'

# Get File encoding
$encoding = Get-FileEncoding $NewMovedFile

# Retrieve article content to update <img> tags with markdown images syntax
$ArticleContent = Get-Content $NewMovedFile -Encoding $encoding
    

# Retrieve all of the old img tags from document
$OldImgTags = Select-String -Path $NewMovedFile -Pattern $ImgHtmlTagsRegex | ForEach-Object {$_.Matches}

Foreach ($matchValue in $OldImgTags)
{
    $oldImgRelativePath = $matchValue.Groups["imgRelativePath"].Value
    $OldImgBaseName = ([io.fileinfo]$oldImgRelativePath).BaseName

    $NewImgTag = "![" + $OldImgBaseName + "](" + $oldImgRelativePath + ")"

    # Replace all the occurences of the old img tag with the new markdown image syntax
    $ArticleContent = $ArticleContent -replace [regex]::Escape($matchValue.Value), $NewImgTag
}


# Save the updated document file with markdown image links
Set-Content $NewMovedFile $ArticleContent -Encoding $encoding



# Remove unused references from article
RemoveUnusedReferences $NewMovedFile


# Copy and replace images in the article
$Document = ProcessImages $NewMovedFile $DocumentMediaFolder $ArticlesMediaFolderRelativePath $InputFileDirectory



#==================================================================================
# Copy includes to "includes" folder and update relative paths for them in article
#==================================================================================

# Definition of chunks regex
$IncludesOldSyntaxRegex = '<div\s+chunk=\"(?<includeRelativePath>.+)\"\s*(/>|>.*</div>)'


# Initialize dictionary containing key = OldIncludeEntireTagMatch and value = NewIncludeRelativePath
$IncludesTagsDictionary = @{}


# Retrieve all of the old include tags from document
$OldIncludeTags = Select-String -Path $NewMovedFile -Pattern $IncludesOldSyntaxRegex | ForEach-Object {$_.Matches}

Foreach ($matchValue in $OldIncludeTags)
{
    $oldIncludeRelativePath = $matchValue.Groups["includeRelativePath"].Value
    $oldIncludeFullPath = Join-path $InputFileDirectory $oldIncludeRelativePath
    $IncludeName = ([io.fileinfo]$oldIncludeFullPath).Name
    $NewIncludeRelativePath = Join-Path ".\includes" $IncludeName

    # Save the old include tag match and the new include relative path in a dictionary for post-processing
    $IncludesTagsDictionary.Add($matchValue, $NewIncludeRelativePath)
}


if($IncludesTagsDictionary.Count -gt 0)
{
    # Check if includes folder already exists. If not, create it
    if(!(Test-Path -Path $IncludesFolder )){
        New-Item -ItemType directory -Path $IncludesFolder | Out-Null # ignore the default output of new-item cmdlet
	    Report-Output -Message "Directory created for Includes at $IncludesFolder"
    }
}


# Copy includes to new location and replace the relative path to them in the article
Foreach ($key in $($IncludesTagsDictionary.keys))
{
    $IncludePath = Join-Path $InputFileDirectory $key.Groups["includeRelativePath"].Value
        
    $IncludeName = ([io.fileinfo]$IncludePath).Name
    $NewIncludesPath = (Join-Path $IncludesFolder $IncludeName)

    if (Test-Path -Path $IncludePath){
        # Check if include already exists in includes destination folder
        if (Test-Path -Path $NewIncludesPath){
            
            # If include exists, ask the user to override it or not
            $caption = "Warning"
            $message = "There is already an include named $IncludeName in $NewIncludesPath. Do you want to override it?"
            $result = PromptYesNo $message $caption
            
            if($result -eq 0) 
            { 
                # YES answer

                # The include uri is valid, proceed and force-copy it to the destination folder
                Copy-Item $IncludePath -Destination $IncludesFolder
				
				Report-Output -Message "Chunk $IncludePath was converted to INCLUDE at $NewIncludesPath"
            }
        }
        else
        {
            # The include uri is valid, proceed and force-copy it to the destination folder
            Copy-Item $IncludePath -Destination $IncludesFolder
			
			Report-Output -Message "Chunk $IncludePath was converted to INCLUDE at $NewIncludesPath"
        }
        
        $NewIncludeRelativePath = Join-Path "..\includes" ([io.fileinfo]$IncludesTagsDictionary[$key]).Name

        $NewIncludeTag = "[WACOM.INCLUDE [" + ([io.fileinfo]$NewIncludeRelativePath).BaseName + "](" + $NewIncludeRelativePath.Replace("\", "/") + ")]"

        # Update document with new image uri
        $Document = $Document -replace [regex]::Escape($key.Value), $NewIncludeTag
		
		Report-Output -Message "Div Chunk $key was converted to $NewIncludeTag"
    }
}


#===================================================
# Process images in all the includes of the article
#===================================================




# INCLUDES IMAGES
Foreach ($key in $($IncludesTagsDictionary.keys))
{
    $value = $IncludesTagsDictionary[$key]

    $OldIncludeRelativePath = $key.Groups["includeRelativePath"].Value
    $OldIncludeFullPath = Join-Path $InputFileDirectory $OldIncludeRelativePath

    # Obtain includes' full path
    [string] $IncludeFilePath = Join-Path $ScriptDir $value
    $IncludesDocMediaFolder = Join-Path $IncludesMediaFolder ([io.fileinfo]$value).BaseName


    if (Test-Path -Path $IncludeFilePath)
    {
        # Retrieve include content to update <img> tags with markdown images syntax
        $includeEncoding = Get-FileEncoding $IncludeFilePath
        $IncludeContent = Get-Content $IncludeFilePath -Encoding $includeEncoding
    

        # Retrieve all of the old img tags from document
        $OldImgTags = Select-String -Path $IncludeFilePath -Pattern $ImgHtmlTagsRegex | ForEach-Object {$_.Matches}

        Foreach ($matchValue in $OldImgTags)
        {
            $oldImgRelativePath = $matchValue.Groups["imgRelativePath"].Value
            $OldImgBaseName = ([io.fileinfo]$oldImgRelativePath).BaseName

            $NewImgTag = "![" + $OldImgBaseName + "](" + $oldImgRelativePath + ")"

            # Replace all the occurences of the old img tag with the new markdown image syntax
            $IncludeContent = $IncludeContent -replace [regex]::Escape($matchValue.Value), $NewImgTag
        }


        # Save the updated document file with markdown image links
        Set-Content $IncludeFilePath $IncludeContent -Encoding $includeEncoding


        # Remove unused references from include
        RemoveUnusedReferences $IncludeFilePath
        
        
        # Copy and replace images for includes
        $IncludesMediaFolderRelativePath = Join-Path ".\media" ([io.fileinfo]$value).BaseName
        $IncludeContent = ProcessImages $IncludeFilePath $IncludesDocMediaFolder $IncludesMediaFolderRelativePath ([io.fileinfo]$OldIncludeFullPath).Directory
    

        # Save the updated document file
        Set-Content $IncludeFilePath $IncludeContent -Encoding $includeEncoding
    }
    else
    {
        Report-Output -Type "Warning" -Message "Include couldn't be found at $IncludeFilePath"
    }
}

# Clear dictionary used for includes tags
$IncludesTagsDictionary.Clear()

# Save the updated article document file
Set-Content $NewMovedFile $Document -Encoding $encoding


Report-Output -Message "Finished migrating $InputFileName to new folder structure!"
Report-Output -Message ""

Stop-Transcript