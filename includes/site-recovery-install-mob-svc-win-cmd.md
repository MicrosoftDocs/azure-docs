1. Copy the installer to a local folder (say C:\Temp) on the server that you want to protect and run the following commands from a elevated command prompt.

  ```
  cd C:\Temp
  ren Microsoft-ASR_UA*Windows*release.exe MobilityServiceInstaller.exe
  MobilityServiceInstaller.exe /q /xC:\Temp\Extracted
  cd C:\Temp\Extracted.
  ```
2. Now we can install the Mobility service using the following command line

  ```
  UnifiedAgent.exe /Role "Agent" /CSEndpoint "IP Address of Configuration Server" /PassphraseFilePath <Full path to the passphrase file>``
  ```

#### Mobility Service Installer Command line arguments

```
Usage :
UnifiedAgent.exe [/Role <Agent/MasterTarget>] [/InstallLocation <Installation Directory>] [/CSIP <IP address>] [/PassphraseFilePath <Passphrase file path>] [/LogFilePath <Log File Path>]<br/>
```

  | Parameter|Type|Description|Possible Values|
  |-|-|-|-|
  |/Role|Mandatory|Specifies whether the Mobility service should be installed|Agent </br> MasterTarget|
  |/InstallLocation|Mandatory|Location where the Mobility Service will  install|Any folder on the computer|
  |/CSIP|Mandatory|IP Address of the Configuration Server| Any valid IP Address|
  |/PassphraseFilePath|Mandatory|Location where the Passphrase is store |Any valid UNC or Local file path|
  |/LogGilePath|Optional|Location for the installation log|Any valid folder on the computer|

#### Sample Usage

```
  UnifiedAgent.exe /Role "Agent" /CSEndpoint "I192.168.2.35" /PassphraseFilePath "C:\Temp\MobSvc.passphrase"
```
