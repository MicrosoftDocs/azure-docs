---
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: include
ms.date: 10/26/2018
ms.author: ankitadutta
---
|Parameter Name| Type | Description| Possible Values|
|-|-|-|-|
| /ServerMode|Mandatory|Specifies whether both the configuration and process servers should be installed, or the process server only|CS<br>PS|
|/InstallLocation|Mandatory|The folder in which the components are installed| Any folder on the computer|
|/MySQLCredsFilePath|Mandatory|The file path in which the MySQL server credentials are stored|The file should be the format specified below|
|/VaultCredsFilePath|Mandatory|The path of the vault credentials file|Valid file path|
|/EnvType|Mandatory|Type of environment that you want to protect |VMware<br>NonVMware|
|/PSIP|Mandatory|IP address of the NIC to be used for replication data transfer| Any valid IP Address|
|/CSIP|Mandatory|The IP address of the NIC on which the configuration server is listening on| Any valid IP Address|
|/PassphraseFilePath|Mandatory|The full path to location of the passphrase file|Valid file path|
|/BypassProxy|Optional|Specifies that the configuration server connects to Azure without a proxy||
|/ProxySettingsFilePath|Optional|Proxy settings (The default proxy requires authentication, or a custom proxy)|The file should be in the format specified below|
|DataTransferSecurePort|Optional|Port number on the PSIP to be used for replication data| Valid Port Number (default value is 9433)|
|/SkipSpaceCheck|Optional|Skip space check for cache disk| |
|/AcceptThirdpartyEULA|Mandatory|Flag implies acceptance of third-party EULA| |
|/ShowThirdpartyEULA|Optional|Displays third-party EULA. If provided as input all other parameters are ignored| |
