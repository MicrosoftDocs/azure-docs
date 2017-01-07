1. Copy the installer to a local folder (say /tmp) on the server that you want to protect and run the following commands from a terminal window.
  ```
  cd /tmp
  tar -xvzf Microsoft-ASR_UA*release.tar.gz
  ```
2. Now we can install the Mobility service using the following command-line

  ```
  sudo sudo ./install -t both -a host -R Agent -d /usr/local/ASR -i <IP address> -p <port> -s y -c https -P MobSvc.passphrase
  ```

#### Mobility Service Installer Command-line arguments
```
UnifiedAgent.exe [/Role <Agent/MasterTarget>] [/InstallLocation <Installation Directory>] [/CSIP <IP address>] [/PassphraseFilePath <Passphrase file path>] [/LogFilePath <Log File Path>]<br/>
```

  | Parameter | Type | Description | Possible Values |
  |-|-|-|-|
  | /Role | Mandatory | Specifies whether the Mobility service should be installed|  Agent</br>MasterTarget|
  | /InstallLocation | Mandatory | Location where the Mobility Service will be installed | Any folder on the computer|
  | /CSIP | Mandatory | IP Address of the Configuration Server| Any valid IP Address |
  | /PassphraseFilePath | Mandatory | Location where the Passphrase is store | Any valid UNC or Local file path|
  | /LogGilePath | Mandatory | Location where the installation log file will be written | Any valid folder on the computer|
