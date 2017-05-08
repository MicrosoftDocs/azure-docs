1. Copy the installer to a local folder (for example, C:\Temp) on the server that you want to protect. Run the following commands as an administrator at a command prompt:

  ```
  cd C:\Temp
  ren Microsoft-ASR_UA*Windows*release.exe MobilityServiceInstaller.exe
  MobilityServiceInstaller.exe /q /x:C:\Temp\Extracted
  cd C:\Temp\Extracted.
  ```
2. To install Mobility Service, run the following command:

  ```
  UnifiedAgent.exe /Role "Agent" /CSEndpoint "IP address of the configuration server" /PassphraseFilePath <Full path to the passphrase file>``
  ```

#### Mobility Service installer command-line arguments

```
Usage :
UnifiedAgent.exe [/Role <Agent/MasterTarget>] [/InstallLocation <Installation directory>] [/CSIP <IP address>] [/PassphraseFilePath <Passphrase file path>] [/LogFilePath <Log file path>]<br/>
```

  | Parameter|Type|Description|Possible values|
  |-|-|-|-|
  |/Role|Mandatory|Specifies whether Mobility Service should be installed|Agent </br> MasterTarget|
  |/InstallLocation|Mandatory|Location where Mobility Service is installed|Any folder on the computer|
  |/CSIP|Mandatory|IP address of the configuration server| Any valid IP address|
  |/PassphraseFilePath|Mandatory|Location of the passphrase |Any valid UNC or local file path|
  |/LogFilePath|Optional|Location of the installation log|Any valid folder on the computer|

#### Example

```
  UnifiedAgent.exe /Role "Agent" /CSEndpoint "I192.168.2.35" /PassphraseFilePath "C:\Temp\MobSvc.passphrase"
```
