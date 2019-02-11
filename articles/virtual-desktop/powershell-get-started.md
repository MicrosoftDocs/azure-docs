# Get started with Windows Virtual Desktop Windows PowerShell cmdlets

Here you will find the resources for PowerShell modules targeting Windows Virtual Desktop.

## Supported PowerShell versions
- Windows PowerShell 5.0 and 5.1

## Download
The Windows Virtual Desktop module is not yet located in the PS Gallery. To download the Windows Virtual Desktop module:

1. Download the [Windows Virtual Desktop module]() and save the package in a known location on your computer.
2. Find the downloaded package. Right-click the zip file, select **Properties**, select **Unblock**, then select **OK**. This will allow your system to trust the module.
3. Right-click the zip file, select **Extract all...**, choose a file location, then select **Extract**.

Keep the location of the extracted zip file handy.

## Import the module for your PowerShell session
To use the Windows Virtual Desktop PowerShell module, you must import it into your PowerShell session. To import the Windows Virtual Desktop:

1. Save the file location of the extracted zip file into a variable
```powershell
$module = "<extracted-module-location>"
```
2. Import the DLL for the module
```powershell
Import-Module $module\Microsoft.RDInfra.RDPowershell.dll
```
You can now run the Windows Virtual Desktop cmdlets. If you close your PowerShell session, you must re-import the module into your session.
