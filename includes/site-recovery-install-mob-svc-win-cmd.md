1. Copy the installer to a local folder (for example, C:\Temp) on the server that you want to protect. Run the following commands as an administrator at a command prompt:

  ```
  cd C:\Temp
  ren Microsoft-ASR_UA*Windows*release.exe MobilityServiceInstaller.exe
  MobilityServiceInstaller.exe /q /x:C:\Temp\Extracted
  cd C:\Temp\Extracted.
  ```
2. To install Mobility Service, run the following command:

  ```
  UnifiedAgent.exe /Role "MS" /InstallLocation "C:\Program Files (x86)\Microsoft Azure Site Recovery" /Platform "VmWare" /Silent
  ```
3. Now the agent needs to be registered with the configuration server.

  ```
  cd C:\Program Files (x86)\Microsoft Azure Site Recovery\agent
  UnifiedAgentConfigurator.exe  /CSEndPoint <CSIP> /PassphraseFilePath <PassphraseFilePath>
  ```

#### Mobility Service installer command-line arguments

```
Usage :
UnifiedAgent.exe /Role <MS|MT> /InstallLocation <Install Location> /Platform “VmWare” /Silent
```

| Parameter|Type|Description|Possible values|
|-|-|-|-|
|/Role|Mandatory|Specifies whether Mobility Service (MS) should be installed or MasterTarget (MT) should be installed.|MS </br> MT|
|/InstallLocation|Optional|Location where Mobility Service is installed.|Any folder on the computer|
|/Platform|Mandatory|Specifies the platform on which Mobility Service is installed. </br> </br>- **VMware**: Use this value if you install Mobility Service on a VM running on *VMware vSphere ESXi hosts*, *Hyper-V hosts*, and *physical servers*. </br> - **Azure**: Use this value if you install an agent on an Azure IaaS VM. | VMware </br> Azure|
|/Silent|Optional|Specifies to run the installer in silent mode.| N/A|

>[!TIP]
> The setup logs can be found under %ProgramData%\ASRSetupLogs\ASRUnifiedAgentInstaller.log.

#### Mobility Service registration command-line arguments

```
Usage :
UnifiedAgentConfigurator.exe  /CSEndPoint <CSIP> /PassphraseFilePath <PassphraseFilePath>
```

  | Parameter|Type|Description|Possible values|
  |-|-|-|-|
  |/CSEndPoint |Mandatory|IP address of the configuration server| Any valid IP address|
  |/PassphraseFilePath|Mandatory|Location of the pass phrase |Any valid UNC or local file path|


>[!TIP]
> The Agent Configuration logs can be found under %ProgramData%\ASRSetupLogs\ASRUnifiedAgentConfigurator.log.
