UnifiedSetup.exe [/ServerMode <CS/PS>] [/InstallDrive <DriveLetter>] [/MySQLCredsFilePath <MySQL credentials file path>] [/VaultCredsFilePath <Vault credentials file path>] [/EnvType <VMWare/NonVMWare>] [/PSIP <IP address to be used for data transfer] [/CSIP <IP address of CS to be registered with>] [/PassphraseFilePath <Passphrase file path>]

Parameters:

* /ServerMode: Mandatory. Specifies whether both the configuration and process servers should be installed, or the process server only. Input values: CS, PS.
* InstallLocation: Mandatory. The folder in which the components are installed.
* /MySQLCredsFilePath. Mandatory. The file path in which the MySQL server credentials are stored. The file should be in this format:
* [MySQLCredentials]
* MySQLRootPassword = "<Password>"
* MySQLUserPassword = "<Password>"
* /VaultCredsFilePath. Mandatory. The location of the vault credentials file
* /EnvType. Mandatory. The type of installation. Values: VMware, NonVMware
* /PSIP and /CSIP. Mandatory. The IP address of the process server and configuration server.
* /PassphraseFilePath. Mandatory. The location of the passphrase file.
* /BypassProxy. Optional. Specifies that the configuration server connects to Azure without a proxy.
* /ProxySettingsFilePath. Optional. Proxy settings (The default proxy requires authentication, or a custom proxy). The file should be in this format:
* [ProxySettings]
* ProxyAuthentication = "Yes/No"
* Proxy IP = "IP Address>"
* ProxyPort = "<Port>"
* ProxyUserName="<User Name>"
* ProxyPassword="<Password>"
* DataTransferSecurePort. Optional. The port number for replication data.
* SkipSpaceCheck. Optional. Skip space checking for cache.
* AcceptThirdpartyEULA. Mandatory. Accepts the third-party EULA.
* ShowThirdpartyEULA. Mandatory. Displays third-party EULA. If provided as input, all other parameters are ignored.
