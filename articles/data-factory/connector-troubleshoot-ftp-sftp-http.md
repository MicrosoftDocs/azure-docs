---
title: Troubleshoot the FTP, SFTP and HTTP connectors
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the FTP, SFTP and HTTP connectors in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 03/27/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the FTP, SFTP and HTTP connectors in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the FTP, SFTP and HTTP connectors in Azure Data Factory and Azure Synapse.

## FTP

### Error code: FtpFailedToConnectToFtpServer

- **Message**: `Failed to connect to FTP server. Please make sure the provided server information is correct, and try again.`

- **Cause**: An incorrect linked service type might be used for the FTP server, such as using the Secure FTP (SFTP) linked service to connect to an FTP server.

- **Recommendation**:  Check the port of the target server. FTP uses port 21.

### Error code: FtpFailedToReadFtpData

- **Message**: `Failed to read data from ftp: The remote server returned an error: 227 Entering Passive Mode (*,*,*,*,*,*).`

- **Cause**: Port range between 1024 to 65535 is not open for data transfer under passive mode supported by the data factory or Synapse pipeline.

- **Recommendation**:  Check the firewall settings of the target server. Open port 1024-65535 or port range specified in FTP server to SHIR/Azure IR IP address.

## SFTP

### Error code: SftpOperationFail

- **Message**: `Failed to '%operation;'. Check detailed error from SFTP.`

- **Cause**: A problem with the SFTP operation.

- **Recommendation**:  Check the error details from SFTP.


### Error code: SftpRenameOperationFail

- **Message**: `Failed to rename the temp file. Your SFTP server doesn't support renaming temp file, set "useTempFileRename" as false in copy sink to disable uploading to temp file.`

- **Cause**: Your SFTP server doesn't support renaming the temp file.

- **Recommendation**:  Set "useTempFileRename" as false in the copy sink to disable uploading to the temp file.


### Error code: SftpInvalidSftpCredential

- **Message**: `Invalid SFTP credential provided for '%type;' authentication type.`

- **Cause**: Private key content is fetched from the Azure key vault or SDK, but it's not encoded correctly.

- **Recommendation**:  

    If the private key content is from your key vault, the original key file can work if you upload it directly to the SFTP linked service.

    For more information, see [Copy data from and to the SFTP server by using data factory or Synapse pipelines](./connector-sftp.md#use-ssh-public-key-authentication). The private key content is base64 encoded SSH private key content.

    Encode *entire* original private key file with base64 encoding, and store the encoded string in your key vault. The original private key file is the one that can work on the SFTP linked service if you select **Upload** from the file.

    Here are some samples you can use to generate the string:

    - Use C# code:

        ```
        byte[] keyContentBytes = File.ReadAllBytes(Private Key Path);
        string keyContent = Convert.ToBase64String(keyContentBytes, Base64FormattingOptions.None);
        ```

    - Use Python code：

        ```
        import base64
        rfd = open(r'{Private Key Path}', 'rb')
        keyContent = rfd.read()
        rfd.close()
        print base64.b64encode(Key Content)
        ```

    - Use a third-party base64 conversion tool. We recommend the [Encode to Base64 format](https://www.base64encode.org/) tool.

- **Cause**: The wrong key content format was chosen.

- **Recommendation**:  

    PKCS#8 format SSH private key (start with "-----BEGIN ENCRYPTED PRIVATE KEY-----") is currently not supported to access the SFTP server. 

    To convert the key to traditional SSH key format, starting with "-----BEGIN RSA PRIVATE KEY-----", run the following commands:

    ```
    openssl pkcs8 -in pkcs8_format_key_file -out traditional_format_key_file
    chmod 600 traditional_format_key_file
    ssh-keygen -f traditional_format_key_file -p
    ```

- **Cause**: Invalid credentials or private key content.

- **Recommendation**:  To see whether your key file or password is correct, double-check with tools such as WinSCP.

### SFTP copy activity failed

- **Symptoms**: 
  * Error code: UserErrorInvalidColumnMappingColumnNotFound 
  * Error message: `Column 'AccMngr' specified in column mapping cannot be found in source data.`

- **Cause**: The source doesn't include a column named "AccMngr."

- **Resolution**: To determine whether the "AccMngr" column exists, double-check your dataset configuration by mapping the destination dataset column.


### Error code: SftpFailedToConnectToSftpServer

- **Message**: `Failed to connect to SFTP server '%server;'.`

- **Cause**: If the error message contains the string "Socket read operation has timed out after 30,000 milliseconds", one possible cause is that an incorrect linked service type is used for the SFTP server. For example, you might be using the FTP linked service to connect to the SFTP server.

- **Recommendation**:  Check the port of the target server. By default, SFTP uses port 22.

- **Cause**: If the error message contains the string "Server response does not contain SSH protocol identification", one possible cause is that the SFTP server throttled the connection. Multiple connections are created to download from the SFTP server in parallel, and sometimes it will encounter SFTP server throttling. Ordinarily, different servers return different errors when they encounter throttling.

- **Recommendation**:  

    Specify the maximum number of concurrent connections of the SFTP dataset as 1 and rerun the copy activity. If the activity succeeds, you can be sure that throttling is the cause.

    If you want to promote the low throughput, contact your SFTP administrator to increase the concurrent connection count limit, or you can do one of the following:

    * If you're using Self-hosted IR, add the Self-hosted IR machine's IP to the allowlist.
    * If you're using Azure IR, add [Azure Integration Runtime IP addresses](./azure-integration-runtime-ip-addresses.md). If you don't want to add a range of IPs to the SFTP server allowlist, use Self-hosted IR instead.


### Error code: SftpPermissionDenied

- **Message**: `Permission denied to access '%path;'`

- **Cause**: The specified user does not have read or write permission to the folder or file when operating.

- **Recommendation**:  Grant the user with permission to read or write to the folder or files on SFTP server.
 
### Error code: SftpAuthenticationFailure

- **Message**: `Meet authentication failure when connect to Sftp server '%server;' using '%type;' authentication type. Please make sure you are using the correct authentication type and the credential is valid. For more details, see our troubleshooting docs.`

- **Cause**: The specified credential (your password or private key) is invalid.

- **Recommendation**: Check your credential.

- **Cause**: The specified authentication type is not allowed or not sufficient to complete the authentication in your SFTP server.

- **Recommendation**: Apply the following options to use the correct authentication type:
    - If your server requires a password, use "Basic".
    - If your server requires a private key, use "SSH public key authentication".
    - If your server requires both "password" and "private key", use "Multiple factor authentication".

- **Cause**: Your SFTP server requires "keyboard-interactive" for authentication, but you provided "password".

- **Recommendation**: 

    "keyboard-interactive" is a special authentication method, which is different from "password". It means that when logging into a server, you must enter the password manually, and you cannot use the previously saved password. But Azure Data Factory (ADF) is a scheduled data transfer service, and there is no pop-up input box allowing you to provide the password at the runtime. <br/> 
    
    As a compromise, an option is provided to simulate the input in the background instead of your real manual input, which is equivalent to changing the "keyboard-interactive" to "password". If you can accept this security concern, follow the steps below to enable it:<br/> 
    1. On the ADF portal, hover on the SFTP linked service, and open its payload by selecting the code button.
    1. Add `"allowKeyboardInteractiveAuth": true` in the "typeProperties" section.

### Unable to connect to SFTP due to key exchange algorithms provided by SFTP are not supported in ADF

- **Symptoms**: You are unable to connect to SFTP via ADF and meet the following error message: `Failed to negotiate key exchange algorithm.`

- **Cause**: The key exchange algorithms provided by the SFTP server are not supported in ADF. The key exchange algorithms supported by ADF are:
    - curve25519-sha256
    - curve25519-sha256@libssh.org
    - ecdh-sha2-nistp256
    - ecdh-sha2-nistp384
    - ecdh-sha2-nistp521
    - diffie-hellman-group-exchange-sha256
    - diffie-hellman-group-exchange-sha1
    - diffie-hellman-group16-sha512
    - diffie-hellman-group14-sha256
    - diffie-hellman-group14-sha1
    - diffie-hellman-group1-sha1

    The latest version to support above key exchange algorithms on SHIR is version 5.19.

### Error Code: SftpInvalidHostKeyFingerprint

- **Message**: `Host key finger-print validation failed. Expected fingerprint is '<value in linked service>', real finger-print is '<server real value>'`

- **Cause**: Azure Data Factory now supports more secure host key algorithms in SFTP connector. For the newly added algorithms, it requires to get the corresponding fingerprint in the SFTP server.

    The newly supported algorithms are:
    
    - ssh-ed25519
    - ecdsa-sha2-nistp256
    - ecdsa-sha2-nistp384
    - ecdsa-sha2-nistp521

- **Recommendation**: Get a valid fingerprint using the Host Key Name in `real finger-print` from the error message in the SFTP server. You can run the command to get the fingerprint on your SFTP server. For example: run `ssh-keygen -E md5 -lf <keyFilePath>` in Linux server to get the fingerprint. The command may vary among different server types.

### Error code: UnsupportedCompressionTypeWhenDisableChunking

- **Message**: `"Disable chunking" is not compatible with "ZipDeflate" decompression.`

- **Cause**: **Disable chunking** is not compatible with **ZipDeflate** decompression.

- **Recommendation**: Load the binary data to a staging area (for example: Azure Blob Storage) and decompress them in another copy activity.

## HTTP

### Error code: HttpFileFailedToRead

- **Message**: `Failed to read data from http server. Check the error from http server：%message;`

- **Cause**: This error occurs when a data factory or a Synapse pipeline talks to the HTTP server, but the HTTP request operation fails.

- **Recommendation**:  Check the HTTP status code in the error message, and fix the remote server issue.

### Error code: HttpSourceUnsupportedStatusCode

- **Message**: `Http source doesn't support HTTP Status Code '%code;'.`

- **Cause**: This error happens when Azure Data Factory requests HTTP source but gets unexpected status code.

- **Recommendation**: For more information about HTTP status code, see this [document](/troubleshoot/developer/webapps/iis/www-administration-management/http-status-code).

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
