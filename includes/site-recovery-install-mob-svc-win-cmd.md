1. Copy the installer to a local folder (for example, C:\Temp) on the server that you want to protect. Run the following commands at an elevated command prompt:

  ```
  cd C:\Temp
  ren Microsoft-ASR_UA*Windows*release.exe MobilityServiceInstaller.exe
  MobilityServiceInstaller.exe /q /xC:\Temp\Extracted
  cd C:\Temp\Extracted.
  ```
2. To install Mobility Service, run the following command line:

  ```
  UnifiedAgent.exe /Role "Agent" /CSEndpoint "IP Address of Configuration Server" /PassphraseFilePath <Full path to the passphrase file>``
  ```

#### Mobility Service Installer command-line arguments

```
Usage :
UnifiedAgent.exe [/Role <Agent/MasterTarget>] [/InstallLocation <Installation Directory>] [/CSIP <IP address>] [/PassphraseFilePath <Passphrase file path>] [/LogFilePath <Log File Path>]<br/>
```

  | Parameter|Type|Description|Possible values|
  |-|-|-|-|
  |/Role|Mandatory|Specifies whether Mobility Service should be installed|Agent </br> MasterTarget|
  |/InstallLocation|Mandatory|Location where Mobility Service is installed|Any folder on the computer|
  |/CSIP|Mandatory|IP Address of the Configuration Server| Any valid IP Address|
  |/PassphraseFilePath|Mandatory|Location where the passphrase is stored |Any valid UNC or local file path|
  |/LogFilePath|Optional|Location of the installation log|Any valid folder on the computer|

#### Sample usage

```
  UnifiedAgent.exe /Role "Agent" /CSEndpoint "I192.168.2.35" /PassphraseFilePath "C:\Temp\MobSvc.passphrase"
```
