1. Copy the installer to a local folder (for example, /tmp) on the server that you want to protect. In a terminal, run the following commands:
  ```
  cd /tmp
  tar -xvzf Microsoft-ASR_UA*release.tar.gz
  ```
2. To install Mobility Service, run the following command:

  ```
  sudo ./install -t both -a host -R Agent -d /usr/local/ASR -i <IP address> -p <port> -s y -c https -P MobSvc.passphrase
  ```

#### Mobility Service installer command-line arguments

|Parameter|Type|Description|Possible values|
|-|-|-|-|
|-t |Mandatory|Agent type<br>(deprecated in an upcoming release)|*both*|
|-a |Mandatory|Agent configuration<br>(deprecated in an upcoming release) |*host*|
|-R |Optional|Role of the agent|Agent<br>MasterTarget|
|-d |Optional|Location where Mobility Service will be installed|/usr/local/ASR|
|-i |Mandatory|IP address of the configuration server|Any valid IP address|
|-p |Mandatory|Port on which the configuration server listens for incoming connections|443|
|-s |Mandatory|Starts the service after a successful installation<br>(deprecated in an upcoming release)|*y*|
|-c |Mandatory|Communication mode between the agent and process server<br>(deprecated in an upcoming release) |*https*|
|-P |Mandatory|Configuration server passphrase|Any valid UNC or local file path|


#### Example
```
sudo ./install -t both -a host -R Agent -d /usr/local/ASR -i 192.168.2.53 -p 443 -s y -c https -P /tmp/MobSvc.passphrase
```
