---
title: Cryptography - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: Learn about cryptography mitigation for threats exposed in the Threat Modeling Tool. See mitigation information and view code examples.
author: jegeib
manager: jegeib
editor: jegeib
ms.service: information-protection
ms.subservice: aiplabels
ms.topic: article
ms.date: 02/07/2017
ms.author: jegeib
---

# Security Frame: Cryptography | Mitigation

| Product/Service | Article |
| --------------- | ------- |
| **Web Application** | <ul><li>[Use only approved symmetric block ciphers and key lengths](#cipher-length)</li><li>[Use approved block cipher modes and initialization vectors for symmetric ciphers](#vector-ciphers)</li><li>[Use approved asymmetric algorithms, key lengths, and padding](#padding)</li><li>[Use approved random number generators](#numgen)</li><li>[Do not use symmetric stream ciphers](#stream-ciphers)</li><li>[Use approved MAC/HMAC/keyed hash algorithms](#mac-hash)</li><li>[Use only approved cryptographic hash functions](#hash-functions)</li></ul> |
| **Database** | <ul><li>[Use strong encryption algorithms to encrypt data in the database](#strong-db)</li><li>[SSIS packages should be encrypted and digitally signed](#ssis-signed)</li><li>[Add digital signature to critical database securables](#securables-db)</li><li>[Use SQL server EKM to protect encryption keys](#ekm-keys)</li><li>[Use AlwaysEncrypted feature if encryption keys should not be revealed to Database engine](#keys-engine)</li></ul> |
| **IoT Device** | <ul><li>[Store Cryptographic Keys securely on IoT Device](#keys-iot)</li></ul> | 
| **IoT Cloud Gateway** | <ul><li>[Generate a random symmetric key of sufficient length for authentication to IoT Hub](#random-hub)</li></ul> | 
| **Dynamics CRM Mobile Client** | <ul><li>[Ensure a device management policy is in place that requires a use PIN and allows remote wiping](#pin-remote)</li></ul> | 
| **Dynamics CRM Outlook Client** | <ul><li>[Ensure a device management policy is in place that requires a PIN/password/auto lock and encrypts all data (e.g. BitLocker)](#bitlocker)</li></ul> | 
| **Identity Server** | <ul><li>[Ensure that signing keys are rolled over when using Identity Server](#rolled-server)</li><li>[Ensure that cryptographically strong client ID, client secret are used in Identity Server](#client-server)</li></ul> | 

## <a id="cipher-length"></a>Use only approved symmetric block ciphers and key lengths

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Products must use only those symmetric block ciphers and associated key lengths which have been explicitly approved by the Crypto Advisor in your organization. Approved symmetric algorithms at Microsoft include the following block ciphers:</p><ul><li>For new code AES-128, AES-192, and AES-256 are acceptable</li><li>For backward compatibility with existing code, three-key 3DES is acceptable</li><li>For products using symmetric block ciphers:<ul><li>Advanced Encryption Standard (AES) is required for new code</li><li>Three-key triple Data Encryption Standard (3DES) is permissible in existing code for backward compatibility</li><li>All other block ciphers, including RC2, DES, 2 Key 3DES, DESX, and Skipjack, may only be used for decrypting old data, and must be replaced if used for encryption</li></ul></li><li>For symmetric block encryption algorithms, a minimum key length of 128 bits is required. The only block encryption algorithm recommended for new code is AES (AES-128, AES-192 and AES-256 are all acceptable)</li><li>Three-key 3DES is currently acceptable if already in use in existing code; transition to AES is recommended. DES, DESX, RC2, and Skipjack are no longer considered secure. These algorithms may only be used for decrypting existing data for the sake of backward-compatibility, and data should be re-encrypted using a recommended block cipher</li></ul><p>Please note that all symmetric block ciphers must be used with an approved cipher mode, which requires use of an appropriate initialization vector (IV). An appropriate IV, is typically a random number and never a constant value</p><p>The use of legacy or otherwise unapproved crypto algorithms and smaller key lengths for reading existing data (as opposed to writing new data) may be permitted after your organization's Crypto Board review. However, you must file for an exception against this requirement. Additionally, in enterprise deployments, products should consider warning administrators when weak crypto is used to read data. Such warnings should be explanatory and actionable. In some cases, it may be appropriate to have Group Policy control the use of weak crypto</p><p>Allowed .NET algorithms for managed crypto agility (in order of preference)</p><ul><li>AesCng (FIPS compliant)</li><li>AuthenticatedAesCng (FIPS compliant)</li><li>AESCryptoServiceProvider (FIPS compliant)</li><li>AESManaged (non-FIPS-compliant)</li></ul><p>Please note that none of these algorithms can be specified via the `SymmetricAlgorithm.Create` or `CryptoConfig.CreateFromName` methods without making changes to the machine.config file. Also, note that AES in versions of .NET prior to .NET 3.5 is named `RijndaelManaged`, and `AesCng` and `AuthenticatedAesCng` are >available through CodePlex and require CNG in the underlying OS</p>

## <a id="vector-ciphers"></a>Use approved block cipher modes and initialization vectors for symmetric ciphers

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | All symmetric block ciphers must be used with an approved symmetric cipher mode. The only approved modes are CBC and CTS. In particular, the electronic code book (ECB) mode of operation should be avoided; use of ECB requires your organization's Crypto Board review. All usage of OFB, CFB, CTR, CCM, and GCM or any other encryption mode must be reviewed by your organization's Crypto Board. Reusing the same initialization vector (IV) with block ciphers in "streaming ciphers modes," such as CTR, may cause encrypted data to be revealed. All symmetric block ciphers must also be used with an appropriate initialization vector (IV). An appropriate IV is a cryptographically strong, random number and never a constant value. |

## <a id="padding"></a>Use approved asymmetric algorithms, key lengths, and padding

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>The use of banned cryptographic algorithms introduces significant risk to product security and must be avoided. Products must use only those cryptographic algorithms and associated key lengths and padding that have been explicitly approved by your organization's Crypto Board.</p><ul><li>**RSA-** may be used for encryption, key exchange and signature. RSA encryption must use only the OAEP or RSA-KEM padding modes. Existing code may use PKCS #1 v1.5 padding mode for compatibility only. Use of null padding is explicitly banned. Keys >= 2048 bits is required for new code. Existing code may support keys < 2048 bits only for backwards compatibility after a review by your organization's Crypto Board. Keys < 1024 bits may only be used for decrypting/verifying old data, and must be replaced if used for encryption or signing operations</li><li>**ECDSA-** may be used for signature only. ECDSA with >=256-bit keys is required for new code. ECDSA-based signatures must use one of the three NIST approved curves (P-256, P-384, or P521). Curves that have been thoroughly analyzed may be used only after a review with your organization's Crypto Board.</li><li>**ECDH-** may be used for key exchange only. ECDH with >=256-bit keys is required for new code. ECDH-based key exchange must use one of the three NIST approved curves (P-256, P-384, or P521). Curves that have been thoroughly analyzed may be used only after a review with your organization's Crypto Board.</li><li>**DSA-** may be acceptable after review and approval from your organization's Crypto Board. Contact your security advisor to schedule your organization's Crypto Board review. If your use of DSA is approved, note that you will need to prohibit use of keys less than 2048 bits in length. CNG supports 2048-bit and greater key lengths as of Windows 8.</li><li>**Diffie-Hellman-** may be used for session key management only. Key length >= 2048 bits is required for new code. Existing code may support key lengths < 2048 bits only for backwards compatibility after a review by your organization's Crypto Board. Keys < 1024 bits may not be used.</li><ul>

## <a id="numgen"></a>Use approved random number generators

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Products must use approved random number generators. Pseudorandom functions such as the C runtime function rand, the .NET Framework class System.Random, or system functions such as GetTickCount must, therefore, never be used in such code. Use of the dual elliptic curve random number generator (DUAL_EC_DRBG) algorithm is prohibited</p><ul><li>**CNG-** BCryptGenRandom(use of the BCRYPT_USE_SYSTEM_PREFERRED_RNG flag recommended unless the caller might run at any IRQL greater than 0 [that is, PASSIVE_LEVEL])</li><li>**CAPI-** cryptGenRandom</li><li>**Win32/64-** RtlGenRandom (new implementations should use BCryptGenRandom or CryptGenRandom) * rand_s * SystemPrng (for kernel mode)</li><li>**.NET-** RNGCryptoServiceProvider or RNGCng</li><li>**Windows Store Apps-** Windows.Security.Cryptography.CryptographicBuffer.GenerateRandom or .GenerateRandomNumber</li><li>**Apple OS X (10.7+)/iOS(2.0+)-** int SecRandomCopyBytes (SecRandomRef random, size_t count, uint8_t \*bytes )</li><li>**Apple OS X (<10.7)-** Use /dev/random to retrieve random numbers</li><li>**Java(including Google Android Java code)-** java.security.SecureRandom class. Note that for Android 4.3 (Jelly Bean), developers must follow the Android recommended workaround and update their applications to explicitly initialize the PRNG with entropy from /dev/urandom or /dev/random</li></ul>|

## <a id="stream-ciphers"></a>Do not use symmetric stream ciphers

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Symmetric stream ciphers, such as RC4, must not be used. Instead of symmetric stream ciphers, products should use a block cipher, specifically AES with a key length of at least 128 bits. |

## <a id="mac-hash"></a>Use approved MAC/HMAC/keyed hash algorithms

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Products must use only approved message authentication code (MAC) or hash-based message authentication code (HMAC) algorithms.</p><p>A message authentication code (MAC) is a piece of information attached to a message that allows its recipient to verify both the authenticity of the sender and the integrity of the message using a secret key. The use of either a hash-based MAC ([HMAC](https://csrc.nist.gov/publications/nistpubs/800-107-rev1/sp800-107-rev1.pdf)) or [block-cipher-based MAC](https://csrc.nist.gov/publications/nistpubs/800-38B/SP_800-38B.pdf) is permissible as long as all underlying hash or symmetric encryption algorithms are also approved for use; currently this includes the HMAC-SHA2 functions (HMAC-SHA256, HMAC-SHA384 and HMAC-SHA512) and the CMAC/OMAC1 and OMAC2 block cipher-based MACs (these are based on AES).</p><p>Use of HMAC-SHA1 may be permissible for platform compatibility, but you will be required to file an exception to this procedure and undergo your organization's Crypto review. Truncation of HMACs to less than 128 bits is not permitted. Using customer methods to hash a key and data is not approved, and must undergo your organization's Crypto Board review prior to use.</p>|

## <a id="hash-functions"></a>Use only approved cryptographic hash functions

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Products must use the SHA-2 family of hash algorithms (SHA256, SHA384, and SHA512). If a shorter hash is needed, such as a 128-bit output length in order to fit a data structure designed with the shorter MD5 hash in mind, product teams may truncate one of the SHA2 hashes (typically SHA256). Note that SHA384 is a truncated version of SHA512. Truncation of cryptographic hashes for security purposes to less than 128 bits is not permitted. New code must not use the MD2, MD4, MD5, SHA-0, SHA-1, or RIPEMD hash algorithms. Hash collisions are computationally feasible for these algorithms, which effectively breaks them.</p><p>Allowed .NET hash algorithms for managed crypto agility (in order of preference):</p><ul><li>SHA512Cng (FIPS compliant)</li><li>SHA384Cng (FIPS compliant)</li><li>SHA256Cng (FIPS compliant)</li><li>SHA512Managed (non-FIPS-compliant) (use SHA512 as algorithm name in calls to HashAlgorithm.Create or CryptoConfig.CreateFromName)</li><li>SHA384Managed (non-FIPS-compliant) (use SHA384 as algorithm name in calls to HashAlgorithm.Create or CryptoConfig.CreateFromName)</li><li>SHA256Managed (non-FIPS-compliant) (use SHA256 as algorithm name in calls to HashAlgorithm.Create or CryptoConfig.CreateFromName)</li><li>SHA512CryptoServiceProvider (FIPS compliant)</li><li>SHA256CryptoServiceProvider (FIPS compliant)</li><li>SHA384CryptoServiceProvider (FIPS compliant)</li></ul>| 

## <a id="strong-db"></a>Use strong encryption algorithms to encrypt data in the database

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Choosing an encryption algorithm](/sql/relational-databases/security/encryption/choose-an-encryption-algorithm) |
| **Steps** | Encryption algorithms define data transformations that cannot be easily reversed by unauthorized users. SQL Server allows administrators and developers to choose from among several algorithms, including DES, Triple DES, TRIPLE_DES_3KEY, RC2, RC4, 128-bit RC4, DESX, 128-bit AES, 192-bit AES, and 256-bit AES |

## <a id="ssis-signed"></a>SSIS packages should be encrypted and digitally signed

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Identify the Source of Packages with Digital Signatures](/sql/integration-services/security/identify-the-source-of-packages-with-digital-signatures), [Threat and Vulnerability Mitigation (Integration Services)](/sql/integration-services/security/security-overview-integration-services) |
| **Steps** | The source of a package is the individual or organization that created the package. Running a package from an unknown or untrusted source might be risky. To prevent unauthorized tampering of SSIS packages, digital signatures should be used. Also, to ensure the confidentiality of the packages during storage/transit, SSIS packages have to be encrypted |

## <a id="securables-db"></a>Add digital signature to critical database securables

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [ADD SIGNATURE (Transact-SQL)](/sql/t-sql/statements/add-signature-transact-sql) |
| **Steps** | In cases where the integrity of a critical database securable has to be verified, digital signatures should be used. Database securables such as a stored procedure, function, assembly, or trigger can be digitally signed. Below is an example of when this can be useful: Let us say an ISV (Independent Software Vendor) has provided support to a software delivered to one of their customers. Before providing support, the ISV would want to ensure that a database securable in the software was not tampered either by mistake or by a malicious attempt. If the securable is digitally signed, the ISV can verify its digital signature and validate its integrity.| 

## <a id="ekm-keys"></a>Use SQL server EKM to protect encryption keys

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [SQL Server Extensible Key Management (EKM)](/sql/relational-databases/security/encryption/extensible-key-management-ekm), [Extensible Key Management Using Azure Key Vault (SQL Server)](/sql/relational-databases/security/encryption/extensible-key-management-using-azure-key-vault-sql-server) |
| **Steps** | SQL Server Extensible Key Management enables the encryption keys that protect the database files to be stored in an off-box device such as a smartcard, USB device, or EKM/HSM module. This also enables data protection from database administrators (except members of the sysadmin group). Data can be encrypted by using encryption keys that only the database user has access to on the external EKM/HSM module. |

## <a id="keys-engine"></a>Use AlwaysEncrypted feature if encryption keys should not be revealed to Database engine

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | SQL Azure, OnPrem |
| **Attributes**              | SQL Version - V12, MsSQL2016 |
| **References**              | [Always Encrypted (Database Engine)](/sql/relational-databases/security/encryption/always-encrypted-database-engine) |
| **Steps** | Always Encrypted is a feature designed to protect sensitive data, such as credit card numbers or national/regional identification numbers (e.g. U.S. social security numbers), stored in Azure SQL Database or SQL Server databases. Always Encrypted allows clients to encrypt sensitive data inside client applications and never reveal the encryption keys to the Database Engine (SQL Database or SQL Server). As a result, Always Encrypted provides a separation between those who own the data (and can view it) and those who manage the data (but should have no access) |

## <a id="keys-iot"></a>Store Cryptographic Keys securely on IoT Device

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Device |
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | Device OS - Windows IoT Core, Device Connectivity - Azure IoT device SDKs |
| **References**              | [TPM on Windows IoT Core](/windows/iot-core/secure-your-device/TPM), [Set up TPM on Windows IoT Core](/windows/iot-core/secure-your-device/setuptpm), [Azure IoT Device SDK TPM](https://github.com/Azure/azure-iot-hub-vs-cs/wiki/Device-Provisioning-with-TPM) |
| **Steps** | Symmetric or Certificate Private keys securely in a hardware protected storage like TPM or Smart Card chips. Windows 10 IoT Core supports the user of a TPM and there are several compatible TPMs that can be used: [Discrete TPM (dTPM)](/windows/iot-core/secure-your-device/tpm#discrete-tpm-dtpm). It is recommended to use a Firmware or Discrete TPM. A Software TPM should only be used for development and testing purposes. Once a TPM is available and the keys are provisioned in it, the code that generates the token should be written without hard coding any sensitive information in it. |

### Example
```
TpmDevice myDevice = new TpmDevice(0);
// Use logical device 0 on the TPM 
string hubUri = myDevice.GetHostName(); 
string deviceId = myDevice.GetDeviceId(); 
string sasToken = myDevice.GetSASToken(); 

var deviceClient = DeviceClient.Create( hubUri, AuthenticationMethodFactory. CreateAuthenticationWithToken(deviceId, sasToken), TransportType.Amqp); 
```
As can be seen, the device primary key is not present in the code. Instead, it is stored in the TPM at slot 0. TPM device generates a short-lived SAS token that is then used to connect to the IoT Hub. 

## <a id="random-hub"></a>Generate a random symmetric key of sufficient length for authentication to IoT Hub

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Cloud Gateway | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | Gateway choice - Azure IoT Hub |
| **References**              | N/A  |
| **Steps** | IoT Hub contains a device Identity Registry and while provisioning a device, automatically generates a random Symmetric key. It is recommended to use this feature of the Azure IoT Hub Identity Registry to generate the key used for authentication. IoT Hub also allows for a key to be specified while creating the device. If a key is generated outside of IoT Hub during device provisioning, it is recommended to create a random symmetric key or at least 256 bits. |

## <a id="pin-remote"></a>Ensure a device management policy is in place that requires a use PIN and allows remote wiping

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM Mobile Client | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure a device management policy is in place that requires a use PIN and allows remote wiping |

## <a id="bitlocker"></a>Ensure a device management policy is in place that requires a PIN/password/auto lock and encrypts all data (e.g. BitLocker)

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM Outlook Client | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure a device management policy is in place that requires a PIN/password/auto lock and encrypts all data (e.g. BitLocker) |

## <a id="rolled-server"></a>Ensure that signing keys are rolled over when using Identity Server

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Identity Server | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Identity Server - Keys, Signatures and Cryptography](https://identityserver.github.io/Documentation/docsv2/configuration/crypto.html) |
| **Steps** | Ensure that signing keys are rolled over when using Identity Server. The link in the references section explains how this should be planned without causing outages to applications relying on Identity Server. |

## <a id="client-server"></a>Ensure that cryptographically strong client ID, client secret are used in Identity Server

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Identity Server | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Ensure that cryptographically strong client ID, client secret are used in Identity Server. The following guidelines should be used while generating a client ID and secret:</p><ul><li>Generate a random GUID as the client ID</li><li>Generate a cryptographically random 256-bit key as the secret</li></ul>|