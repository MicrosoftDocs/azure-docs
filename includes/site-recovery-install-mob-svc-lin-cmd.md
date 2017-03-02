1. Copy the installer to a local folder (say /tmp) on the server that you want to protect and run the following commands from a terminal window.
  ```
  cd /tmp
  tar -xvzf Microsoft-ASR_UA*release.tar.gz
  ```
2. Now we can install the Mobility service using the following command-line

  ```
  sudo ./install -t both -a host -R Agent -d /usr/local/ASR -i <IP address> -p <port> -s y -c https -P MobSvc.passphrase
  ```

#### Mobility Service Installer Command-line arguments

|Parameter|Type|Description|Possible Values|
|-|-|-|-|
|-t |Mandatory|Agent Type<br>(Will be deprecated in the next release)|*both*|
|-a |Mandatory|Agent Configuration<br>(Will be deprecated in the next release) |*host*|
|-R |Optional|Role of the Agent|Agent<br>MasterTarget|
|-d |Optional|Location where the Mobility Service will install|/usr/local/ASR|
|-i |Mandatory|IP Address of the configuration server.|Any valid IP Address|
|-p |Mandatory|Port on which the Configuration server is listening for incoming connections|443|
|-s |Mandatory|Start service after a successful install<br>(Will be deprecated in the next release)|*y*|
|-c |Mandatory|Communication mode between Agent and Process Server<br>(Will be deprecated in the next release) |*https*|
|-P |Mandatory|Configuration Server passphrase|Any valid UNC or local file path|


#### Sample Usage
```
sudo ./install -t both -a host -R Agent -d /usr/local/ASR -i 192.168.2.53 -p 443 -s y -c https -P /tmp/MobSvc.passphrase
```
