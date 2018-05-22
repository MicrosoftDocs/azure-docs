1. Copy the installer to a local folder (for example, /tmp) on the server that you want to protect. In a terminal, run the following commands:
  ```
  cd /tmp ;

  tar -xvzf Microsoft-ASR_UA*release.tar.gz
  ```
2. To install Mobility Service, run the following command:

  ```
  sudo ./install -d <Install Location> -r MS -v VmWare -q
  ```
3. After installation is finished, Mobility Service must be registered to the configuration server. Run the following command to register Mobility Service with the configuration server:

  ```
  /usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i <CSIP> -P /var/passphrase.txt
  ```

#### Mobility Service installer command line

```
Usage:
./install -d <Install Location> -r <MS|MT> -v VmWare -q
```

|Parameter|Type|Description|Possible values|
|-|-|-|-|
|-r |Mandatory|Specifies whether Mobility Service (MS) should be installed or MasterTarget (MT) should be installed.|MS </br> MT|
|-d |Optional|Location where Mobility Service is installed.|/usr/local/ASR|
|-v|Mandatory|Specifies the platform on which Mobility Service is installed. </br> </br>- **VMware**: Use this value if you install Mobility Service on a VM running on *VMware vSphere ESXi hosts*, *Hyper-V hosts*, and *physical servers*. </br> - **Azure**: Use this value if you install an agent on an Azure IaaS VM.| VMware </br> Azure|
|-q|Optional|Specifies to run the installer in silent mode.| N/A|


#### Mobility Service configuration command line

```
Usage:
cd /usr/local/ASR/Vx/bin
UnifiedAgentConfigurator.sh -i <CSIP> -P <PassphraseFilePath>
```

|Parameter|Type|Description|Possible values|
|-|-|-|-|
|-i |Mandatory|IP of the configuration server|Any valid IP Address|
|-P |Mandatory|Full file path for the file where the connection pass phrase is saved|Any valid folder|
