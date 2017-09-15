# cleanup_win.ps1
# Copyright (c) Microsoft. All rights reserved.

# Close AML Workbench 
if ((Get-Process | Where-Object ProcessName -eq 'AmlWorkbench').count -gt 0) 
{
	Stop-Process -Name AmlWorkbench
 	# sleep for 5 secons and wait till all processes are killed
	Start-Sleep 5
}

# Close Vienna
if ((Get-Process | Where-Object ProcessName -eq 'Vienna').count -gt 0) 
{
	Stop-Process -Name Vienna
 	# sleep for 5 secons and wait till all processes are killed
	Start-Sleep 5
}

$local = $env:LOCALAPPDATA
$localv = [System.IO.Path]::Combine($local, "amlworkbench")
if(Test-Path -Path $localv)
{
    Write-Host $localv "exists, deleting..."
    Remove-Item $localv -Force -Recurse
    Write-Host "done"
}

$localv = [System.IO.Path]::Combine($local, "vienna")
if(Test-Path -Path $localv)
{
    Write-Host $localv "exists, deleting..."
    Remove-Item $localv -Force -Recurse
    Write-Host "done"
}

# New installer
$localv = [System.IO.Path]::Combine($local, "amlinstaller")
if(Test-Path -Path $localv)
{
    Write-Host $localv "exists, deleting..."
    Remove-Item $localv -Force -Recurse
    Write-Host "done"
}

$remote = $env:APPDATA
$remotev = [System.IO.Path]::Combine($remote, "AmlWorkbench")
if(Test-Path -Path $remotev)
{
    Write-Host $remotev "exists, deleting..."
    Remove-Item $remotev -Force -Recurse
    Write-Host "done"
}

$remotev = [System.IO.Path]::Combine($remote, "vienna")
if(Test-Path -Path $remotev)
{
    Write-Host $remotev "exists, deleting..."
    Remove-Item $remotev -Force -Recurse
    Write-Host "done"
}

$remotev = [System.IO.Path]::Combine($remote, "ciworkbench")
if(Test-Path -Path $remotev)
{
    Write-Host $remotev "exists, deleting..."
    Remove-Item $remotev -Force -Recurse
    Write-Host "done"
}
