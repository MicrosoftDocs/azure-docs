1. Copy the installer to a local folder (for example, /tmp) on the server that you want to protect. Run the following commands from a terminal window:
  ```
  cd /tmp
  tar -xvzf Microsoft-ASR_UA*release.tar.gz
  ```
2. To install Mobility Service, use the following command line:

  ```
  sudo ./install -t both -a host -R Agent -d /usr/local/ASR -i <IP address> -p <port> -s y -c https -P MobSvc.passphrase
  ```

#### Mobility Service installer command-line arguments

|Parameter|Type|Description|Possible values|
|-|-|-|-|
|-t |Mandatory|Agent type<br>(Will be deprecated in the next release)|*both*|
|-a |Mandatory|Agent configuration<br>(Will be deprecated in the next release) |*host*|
|-R |Optional|Role of the agent|Agent<br>MasterTarget|
|-d |Optional|Where Mobility Service will be installed|/usr/local/ASR|
|-i |Mandatory|IP address of Configuration Server|Any valid IP Address|
|-p |Mandatory|Port on which Configuration Server listens for incoming connections|443|
|-s |Mandatory|Start service after a successful install<br>(Will be deprecated in the next release)|*y*|
|-c |Mandatory|Communication mode between the agent and process server<br>(Will be deprecated in the next release) |*https*|
|-P |Mandatory|Configuration Server passphrase|Any valid UNC or local file path|


#### Sample usage
```
sudo ./install -t both -a host -R Agent -d /usr/local/ASR -i 192.168.2.53 -p 443 -s y -c https -P /tmp/MobSvc.passphrase
```
