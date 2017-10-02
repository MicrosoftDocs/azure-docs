1. Copy the installer to a local folder (for example, /tmp) on the server that you want to protect. In a terminal, run the following commands:
  ```
  cd /tmp
  tar -xvzf Microsoft-ASR_UA*release.tar.gz
  ```
2. To install Mobility Service, run the following command:

  ```
  sudo ./install -d <Install Location> -r MS -v VmWare -q
  ```
3. Once installation is complete, the Mobility Service needs to get registered to the configuration server. Run the following command to register the Mobility Service with Configuration server.

  ```
  /usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i <CSIP> -P /var/passphrase.txt
  ```

#### Mobility Service installer command-line

```
Usage:
./install -d <Install Location> -r <MS|MT> -v VmWare -q
```

|Parameter|Type|Description|Possible values|
|-|-|-|-|
|-r |Mandatory|Specifies whether Mobility Service (MS) should be installed or MasterTarget(MT) should be installed|MS </br> MT|
|-d |Optional|Location where Mobility Service will be installed|/usr/local/ASR|
|-v|Mandatory|Specifies the platform on which the Mobility Service is getting installed </br> </br>- **VMware** : use this value if you are installing mobility service on a VM running on *VMware vSphere ESXi Hosts*, *Hyper-V Hosts* and *Phsyical Servers* </br> - **Azure** : use this value if you are installing agent on a Azure IaaS VM| VMware </br> Azure|
|-q|Optional|Specifies to run installer in silent mode| N/A|


#### Mobility Service configuration command-line

```
Usage:
cd /usr/local/ASR/Vx/bin
UnifiedAgentConfigurator.sh -i <CSIP> -P <PassphraseFilePath>
```

|Parameter|Type|Description|Possible values|
|-|-|-|-|
|-i |Mandatory|IP of the Configuration Server|Any valid IP Address|
|-P |Mandatory|Full file path the file where the connection passphrase is saved|Any valid folder|
