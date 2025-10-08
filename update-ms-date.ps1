# PowerShell script to update ms.date in files authored by pri-mittal

# Get all markdown files containing 'pri-mittal'
$files = Get-ChildItem -Path . -Recurse -Include "*.md" | Select-String -Pattern "pri-mittal" | ForEach-Object { $_.Path } | Sort-Object -Unique

Write-Host "Found $($files.Count) files to update:"

foreach ($file in $files) {
    Write-Host "Processing: $file"
    
    # Read the content
    $content = Get-Content -Path $file -Raw
    
    # Update ms.date pattern - looking for lines like "ms.date: MM/DD/YYYY"
    $updatedContent = $content -replace "ms\.date:\s*\d{2}/\d{2}/\d{4}", "ms.date: 10/08/2025"
    
    # Write back to file
    Set-Content -Path $file -Value $updatedContent -NoNewline
    
    Write-Host "Updated: $file"
}

Write-Host "All files updated successfully!"