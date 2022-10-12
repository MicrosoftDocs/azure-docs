---
title: Detect exposed secrets in code
titleSuffix: Defender for Cloud
description: Prevent passwords and other secrets that may be stored in your code from being accessed by outside individuals by using Defender for Cloud's secret scanning for Defender for DevOps.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 09/11/2022
---

# Detect exposed secrets in code

When passwords and other secrets are stored in source code, it poses a significant risk and could compromise the security of your environments. Defender for Cloud offers a solution by using secret scanning to detect credentials, secrets, certificates, and other sensitive content in your source code and your build output. Secret scanning can be run as part of the Microsoft Security DevOps for Azure DevOps extension. To explore the options available for secret scanning in GitHub, learn more [about secret scanning](https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/about-secret-scanning) in GitHub.

> [!NOTE]
> During the Defender for DevOps preview period, GitHub Advanced Security for Azure DevOps (GHAS for AzDO) is also providing a free trial of secret scanning.

Check the list of [supported file types and exit codes](#supported-file-types-and-exit-codes).

## Prerequisites

- An Azure subscription. If you don't have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

- [Configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md)

## Setup secret scanning in Azure DevOps

You can run secret scanning as part of the Azure DevOps build process by using the Microsoft Security DevOps (MSDO) Azure DevOps extension.

**To add secret scanning to Azure DevOps build process**:

1. Sign in to [Azure DevOps](https://dev.azure.com/)

1. Navigate to **Pipeline**.

1. Locate the pipeline with MSDO Azure DevOps Extension is configured.

1. Select **Edit**.

1. Add the following lines to the YAML file

    ```yml
    inputs:
        categories: 'secrets'
    ```

1.  Select **Save**.

By adding the additions to your yaml file, you will ensure that secret scanning only runs when you execute a build to your Azure DevOps pipeline.

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

## Supported file types and exit codes

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

## Next steps
+ Learn how to [configure pull request annotations](tutorial-enable-pull-request-annotations.md) in Defender for Cloud to remediate secrets in code before they are shipped to production.
