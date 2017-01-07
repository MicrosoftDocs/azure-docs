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
|-t |Mandatory|ToDo Venu|ToDo Venu|
|-a |Mandatory|ToDo Venu|ToDo Venu|
|-R |Mandatory|ToDo Venu|ToDo Venu|
|-d |Mandatory|Location where the Mobility Service will be installed|/usr/local/ASR|
|-i |Mandatory|IP Address of the configuration server.|Any valid IP Address|
|-p |Mandatory|Port on which the Configuration server is listening for incoming connections|443|
|-s |Mandatory|ToDo Venu|ToDo Venu|
|-c |Mandatory|ToDo Venu|ToDo Venu|
|-P |Mandatory|Configuration Server passphrase|Any valid UNC or local file path|


#### Sample Usage
```
sudo ./install -t both -a host -R Agent -d /usr/local/ASR -i 192.168.2.53 -p 443 -s y -c https -P /tmp/MobSvc.passphrase
```
