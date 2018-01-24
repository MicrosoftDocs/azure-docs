#takes TOC markdown file (TOC.md for example) as input
#param to control removal of original
param(
  [parameter(Mandatory=$true)]
  [string]$File='TOC.md',
  [parameter(Mandatory=$false)]
  [string]$OutputFile='output.yml',
  [switch]$Replace=$false
)

#                new Regex(@"^(?<headerLevel>#+)(( |\t)*)\[(?<tocTitle>.+)\]\((?<tocLink>(?!http[s]?://).*?)(\)| ""(?<displayText>.*)""\))( |\t)*#*( |\t)*(\n|$)", RegexOptions.Compiled);

function ProcessTOCLevel([Int32]$level)
{
    Write-Host Process TOC $level
	do {
		$line = $tocLines[$currentIndex]
        #Write-Host line: $line
        $tocLink = ''
        $displayName = ''
        $headerLevel = ''
        $tocTitle = ''
		$lineMatches = $line -match "^(?<headerLevel>#+)(( |\t)*)\[(?<tocTitle>.+)\]\((?<tocLink>.*?)(\)| ""(?<displayName>.*)""\))( |\t)*#*( |\t)*(\n|$)"

        if (!($lineMatches)) {
            $lineMatches = $line -match "^(?<headerLevel>#+)(( |\t)*)(?<tocTitle>.+?)( |\t)*#*( |\t)*(\n|$)" #no link version
        }

        if ($lineMatches)
        {
		    $headerLevel = $Matches['headerLevel']
            $tocTitle = $Matches['tocTitle']
            $tocLink = $Matches['tocLink']
            $displayName = $Matches['displayName']
            [Int32]$headerLevelNum = $headerLevel.length
            if ($headerLevelNum -gt $level)
            {
                $spacing = "  " * $level
                $OutputLine = $spacing + "items:"
                $outputLines.Add($OutputLine)

                $level = $headerLevelNum
            }
            elseif ($headerLevelNum -lt $level) {
                $level = $headerLevelNum
            }
            $spacing = "  " * ($level - 1)
            $OutputLine = $spacing + "- name: " + $tocTitle
            $outputLines.Add($OutputLine)

            if ($tocLink) {
                $spacing = "  " * $level
                $OutputLine = $spacing + "href: " + $tocLink
                $outputLines.Add($OutputLine)            
            }

            if ($displayName) {
                $OutputLine = $spacing + "displayName: " + $displayName
                $outputLines.Add($OutputLine)
            }
        }

    	$currentIndex = $currentIndex + 1

        #Write-Host Current Index $currentIndex

	} while ($currentIndex -lt $lineCount)
	return 
}

$outputLines = New-Object System.Collections.Generic.List[System.String]

$tocLines = Get-Content $File
$lineCount = $tocLines.Length
$currentIndex = 0
ProcessTOCLevel(1)
Set-Content $OutputFile $outputLines

