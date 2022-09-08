---
title: Enable credential scanning in code
description: Prevent passwords and other secrets that may be stored in your code from being accessed by outside individuals by using Defender for Cloud's credential scanner for Defender for DevOps.
ms.topic: how-to
ms.date: 09/08/2022
---

# Detect credential leaks in code

When passwords and other secrets are stored in source code, it poses a significant problem. Defender for Cloud offers a solution by using Credential Scanner (CredScan). Credential Scanner detects credentials, secrets, certificates, and other sensitive content in your source code and your build output. Credential Scanner can be run as part of the Microsoft Security DevOps for Azure DevOps extension.

CredScan supports the following file types:

| Supported file types |  |  |  |  |  |
|--|--|--|--|--|--|
| 0.001 |\*.conf | id_rsa |\*.p12 |\*.sarif |\*.wadcfgx |
| 0.1 |\*.config |\*.iis |\*.p12* |\*.sc |\*.waz |
| 0.8 |\*.cpp |\*.ijs |\*.params |\*.scala |\*.webtest |
| *_sk |\*.crt |\*.inc | password |\*.scn |\*.wsx |
| *password |\*.cs |\*.inf |\*.pem | scopebindings.json |\*.wtl |
| *pwd*.txt |\*.cscfg |\*.ini |\*.pfx* |\*.scr |\*.xaml |
|\*.*_/key |\*.cshtm |\*.ino | pgpass |\*.script |\*.xdt |
|\*.*__/key |\*.cshtml |\*.insecure |\*.php |\*.sdf |\*.xml |
|\*.1/key |\*.csl |\*.install |\*.pkcs12* |\*.secret |\*.xslt |
|\*.32bit |\*.csv |\*.ipynb |\*.pl |\*.settings |\*.yaml |
|\*.3des |\*.cxx |\*.isml |\*.plist |\*.sh |\*.yml |
|\*.added_cluster |\*.dart |\*.j2 |\*.pm |\*.shf |\*.zaliases |
|\*.aes128 |\*.dat |\*.ja |\*.pod |\*.side |\*.zhistory |
|\*.aes192 |\*.data |\*.jade |\*.positive |\*.side2 |\*.zprofile |
|\*.aes256 |\*.dbg |\*.java |\*.ppk* |\*.snap |\*.zsh_aliases |
|\*.al |\*.defaults |\*.jks* |\*.priv |\*.snippet |\*.zsh_history |
|\*.argfile |\*.definitions |\*.js | privatekey |\*.sql |\*.zsh_profile |
|\*.as |\*.deployment |\*.json | privatkey |\*.ss |\*.zshrc |
|\*.asax | dockerfile |\*.jsonnet |\*.prop | ssh\\config |  |
|\*.asc | _dsa |\*.jsx |\*.properties | ssh_config |  |
|\*.ascx |\*.dsql | kefile |\*.ps |\*.ste |  |
|\*.asl |\*.dtsx | key |\*.ps1 |\*.svc |  |
|\*.asmmeta | _ecdsa | keyfile |\*.psclass1 |\*.svd |  |
|\*.asmx | _ed25519 |\*.key |\*.psm1 |\*.svg |  |
|\*.aspx |\*.ejs |\*.key* | psql_history |\*.svn-base |  |
|\*.aurora |\*.env |\*.key.* |\*.pub |\*.swift |  |
|\*.azure |\*.erb |\*.keys |\*.publishsettings |\*.tcl |  |
|\*.backup |\*.ext |\*.keystore* |\*.pubxml |\*.template |  |
|\*.bak |\*.ExtendedTests |\*.linq |\*.pubxml.user | template |  |
|\*.bas |\*.FF |\*.loadtest |\*.pvk* |\*.test |  |
|\*.bash_aliases |\*.frm |\*.local |\*.py |\*.textile |  |
|\*.bash_history |\*.gcfg |\*.log |\*.pyo |\*.tf |  |
|\*.bash_profile |\*.git |\*.m |\*.r |\*.tfvars |  |
|\*.bashrc |\*.git/config |\*.managers |\*.rake | tmdb |  |
|\*.bat |\*.gitcredentials |\*.map |\*.razor |\*.trd |  |
|\*.Beta |\*.go |\*.md |\*.rb |\*.trx |  |
|\*.BF |\*.gradle |\*.md-e |\*.rc |\*.ts |  |
|\*.bicep |\*.groovy |\*.mef |\*.rdg |\*.tsv |  |
|\*.bim |\*.grooy |\*.mst |\*.rds |\*.tsx |  |
|\*.bks* |\*.gsh |\*.my |\*.reg |\*.tt |  |
|\*.build |\*.gvy |\*.mysql_aliases |\*.resx |\*.txt |  |
|\*.c |\*.gy |\*.mysql_history |\*.retail |\*.user |  |
|\*.cc |\*.h |\*.mysql_profile |\*.robot | user |  |
|\*.ccf | host | npmrc |\*.rqy | userconfig* |  |
|\*.cfg |\*.hpp |\*.nuspec | _rsa |\*.usersaptinstall |  |
|\*.clean |\*.htm |\*.ois_export |\*.rst |\*.usersaptinstall |  |
|\*.cls |\*.html |\*.omi |\*.ruby |\*.vb |  |
|\*.cmd |\*.htpassword |\*.opn |\*.runsettings |\*.vbs |  |
|\*.code-workspace | hubot |\*.orig |\*.sample |\*.vizfx |  |
|\*.coffee |\*.idl |\*.out |\*.SAMPLE |\*.vue |  |

The following exit codes are available in CredScan:

| Code | Description |
|--|--|
| 0 | Scan completed successfully with no application warning, no suppressed match, no credential match. |
| 1 | Partial scan completed with nothing but application warning. |
| 2 | Scan completed successfully with nothing but suppressed match(es). |
| 3 | Partial scan completed with both application warning(s) and suppressed match(es). |
| 4 | Scan completed successfully with nothing but credential match(es). |
| 5 | Partial scan completed with both application warning(s) and credential match(es). |
| 6 | Scan completed successfully with both suppressed match(es) and credential match(es). |
| 7 | Partial scan completed with application warning(s), suppressed match(es) and credential match(es). |
| -1000 | Scan failed with command line argument error. |
| -1100 | Scan failed with app settings error. |
| -1500 | Scan failed with other configuration error. |
| -1600 | Scan failed with IO error. |
| -9000 | Scan failed with unknown error. |

## Setup credential scanning

You can run CredScan as part of the Azure DevOps build process by using the Microsoft Security DevOps (MSDO) Azure DevOps extension.

**To add Credential Scanner to Azure DevOps build process**:

1. ????? Need all the steps prior to step 2?????

1. Select the relevant Azure DevOps build definition.

1. Add the Credential Scanner build task to your build definition after the publishing steps for your build artifacts **HOW IS THIS DONE** using the classic UI or the yaml editor/assistant.

1. Customize the scanner based on your requirements.

    :::image type="content" source="media/detect-credential-leaks/credscan.png" alt-text="Screenshot of the custimaztion screen used by the credential scanning tool.":::

    | Field name | Options available |
    |--|--|
    | **ARE THE FIRST 2 The Same? Version and Tool Major version????** |  |
    | Version | The build task version within Azure DevOps. This option isn't frequently used. |        
    | Tool Major Version | CredScan V2, CredScan V1. <br> We recommend customers use the CredScan V2 version. |
    | Display Name | Enter the name of the Azure DevOps Task. The default value is Run Credential Scanner. |
    | Output Format | TSV, CSV, SARIF, and PREfast. |
    | Tool Version | **What are the options?** <br> We recommend you select `Latest`. |
    | Scan Folder | Select the repository folder to be scanned. |
    | Searchers File Type | The options for locating the searchers file that is used for scanning. |
    | Suppressions File | A JSON file can suppress issues in the output log. For more information about suppression scenarios, see the FAQ section of this article. |
    | Suppress as Error |  |
    | Verbose Output |   |
    | Batch Size | The number of concurrent threads used to run Credential Scanner. The default value is 20. <br> Possible values range from 1 through 2,147,483,647. |
    | Regex Match Timeout in Seconds | The amount of time (in seconds) to spend attempting a searcher match before abandoning the check. |
    | File Scan Read Buffer Size | The size (in bytes) of the buffer used while content is read. The default value is 524,288. |
    | Maximum File Scan Read Bytes | The maximum number of bytes to read from a file during content analysis. The default value is 104,857,600. |
    | Control Options > Run this task | Specifies when the task will run. Select Custom conditions to specify more complex conditions. |

1. Select **Save**.

## Suppress false positives

When the scanner runs, it may detect credentials that are false positives. Inline-suppression tools can be used to suppress false positives. 

You may want to suppress fake secrets in unit tests or mock paths, or inaccurate results. We don't recommend using suppression to suppress test credentials. Test credentials can still pose a security risk and should be securely stored.

> [!NOTE]
> Valid inline suppression syntax depends on the language, data format and CredScan version you are using. 

### Suppress a same line secret

To suppress a secret that is found on the same line, add the following code as a comment at the end of the line that has the secret:

```bash
[SuppressMessage("Microsoft.Security", "CS001:SecretInLine", Justification="... .")]
```

### Suppress a secret in the next line 

To suppress the secret found in the next line, add the following code as a comment before the line that has the secret:

```bash
[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="... .")]
```

## Next steps
