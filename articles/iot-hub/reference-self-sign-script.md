---
title: Script to Self Sign a CSR Certificate in Azure Device Registry
description: "Use a sample script to self sign a certificate signing request (CSR) for test purposes."
author: sethmanheim
ms.author: sethm
ms.topic: reference
ms.service: azure-iot-hub
ms.date: 04/14/2026
---

# Create a root CA and private key to sign a certificate signing request (CSR) from ADR

You can use the provided PowerShell script to create a free root CA and private key using OpenSSL. This script should only be used for testing and never for production environments.

## Prerequisites

- A Device Registry namespace. For setup steps, see [Configure a Root CA credential in Azure Device Registry](how-to-configure-credential.md).
- A Device Registry policy with an [external root CA](how-to-create-policy-external-certificate.md). Download the CSR file from your external root CA to your local machine.
- Install OpenSSL. If you don't have OpenSSL installed, use the command `winget install --id ShiningLight.OpenSSL.Dev -e`. Add OpenSSL to PATH in your environment variables.

## Script

Save the following PowerShell script in a file called *selfsign.ps1*. Place this script in the same directory where you downloaded the CSR file.

Replace `<path to the downloaded CSR>` in the script with the name of your CSR file.

```powershell
# What this script does: 
# 1. Creates a self-signed Root CA (a top-level certificate authority) and its private key.
# 2. Takes a CSR (Certificate Signing Request) that was generated elsewhere, and signs it with that Root CA to produce an intermediate CA (ICA) certificate
# 3. Builds a certificate chain file (ICA certificate + Root CA certificate) that you can upload/use as proof that the ICA is trusted.

$SCRIPT_DIR = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$ROOT_CA_KEY = Join-Path $SCRIPT_DIR "byor-root-ca-key.pem"
$ROOT_CA_CERT = Join-Path $SCRIPT_DIR "byor-root-ca.pem"
$ICA_CERT = Join-Path $SCRIPT_DIR "byor-ica-cert.pem"
$ICA_EXTENSIONS = Join-Path $SCRIPT_DIR "byor-ica-extensions.cnf"
$CERT_CHAIN = Join-Path $SCRIPT_DIR "byor-certificate-chain.pem"

# IMPORTANT: Add the file path for your CSR
$CSR_FILE = "<path to the downloaded CSR>"

# Create Self-Signed Root CA
Write-Host "Creating Self-Signed Root CA (ECC P-384)..." -ForegroundColor Green
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$ROOT_CA_SUBJECT = "/CN=Test External Root CA - - $timestamp"

# Create ECC P-384 Root CA private key
Write-Host "    Creating ECC P-384 private key..." -ForegroundColor Gray
& openssl ecparam -name secp384r1 -genkey -noout -out $ROOT_CA_KEY 2>&1
if (-not (Test-Path $ROOT_CA_KEY)) {
    Write-Host "    ERROR: Failed to create Root CA private key" -ForegroundColor Red
    exit 1
}
Write-Host "    SUCCESS: Private key created: $ROOT_CA_KEY" -ForegroundColor Gray

# Create self-signed Root CA certificate with a validity of 10 years, path length of 1 (Root -> ICA -> Leaf), and restricted key usage
Write-Host "    Creating self-signed Root CA certificate..." -ForegroundColor Gray
& openssl req -new -x509 -key $ROOT_CA_KEY -out $ROOT_CA_CERT -days 3650 -subj $ROOT_CA_SUBJECT `
    -addext "basicConstraints=critical,CA:TRUE,pathlen:1" `
    -addext "keyUsage=critical,keyCertSign,cRLSign" `
    -sha384 2>&1

if (-not (Test-Path $ROOT_CA_CERT)) {
    Write-Host "    ERROR: Failed to create Root CA certificate" -ForegroundColor Red
    exit 1
}
Write-Host "    SUCCESS: Root CA certificate created: $ROOT_CA_CERT" -ForegroundColor Gray

# Sign CSR with Root CA
Write-Host "Signing CSR with Root CA (fixing EC named curve encoding)..." -ForegroundColor Green


# Create temporary files for public key extraction and fix
$CSR_PUBKEY = Join-Path $SCRIPT_DIR "byor-csr-pubkey.pem"
$CSR_PUBKEY_FIXED = Join-Path $SCRIPT_DIR "byor-csr-pubkey-fixed.pem"
$CSR_FIXED = Join-Path $SCRIPT_DIR "byor-csr-fixed.pem"

# Extract public key from original CSR
Write-Host "    Extracting public key from CSR..." -ForegroundColor Gray
& openssl req -in $CSR_FILE -pubkey -noout -out $CSR_PUBKEY 2>&1

if (-not (Test-Path $CSR_PUBKEY)) {
    Write-Host "    ERROR: Failed to extract public key from CSR" -ForegroundColor Red
    exit 1
}

# Check if the public key has explicit parameters and fix it
# We use openssl ec to read and re-write the key with named curve format
Write-Host "Converting EC key to named curve format..." -ForegroundColor Green
& openssl ec -pubin -in $CSR_PUBKEY -out $CSR_PUBKEY_FIXED -param_enc named_curve 2>&1

# If conversion succeeded, use the fixed key; otherwise fall back to original
if (Test-Path $CSR_PUBKEY_FIXED) {
    Write-Host "    SUCCESS: EC key converted to named curve format" -ForegroundColor Gray
    $useFixedKey = $true
} else {
    Write-Host "    Using original public key (may already be named curve)" -ForegroundColor Yellow
    $CSR_PUBKEY_FIXED = $CSR_PUBKEY
    $useFixedKey = $false
}

# Extract subject from original CSR
$csrSubject = & openssl req -in $CSR_FILE -noout -subject 2>&1
# Parse subject - it comes as "subject=CN = xxx" or "subject= /CN=xxx"
$csrSubjectCN = $csrSubject -replace "subject\s*=\s*", "" -replace "^\s*", ""
Write-Host "    Original CSR subject: $csrSubjectCN" -ForegroundColor Gray

# Create OpenSSL extensions configuration file for ICA certificate
# IMPORTANT: This section tells OpenSSL what properties the ICA Certificate must have: extendedKeyUsage = clientAuth is REQUIRED for BYOR activation
Write-Host "    Creating extensions configuration file..." -ForegroundColor Gray
$extensionsConfig = @"
[ ica_ext ]
basicConstraints = critical, CA:TRUE, pathlen:0
keyUsage = critical, keyCertSign, cRLSign, digitalSignature
extendedKeyUsage = clientAuth
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always, issuer:always
"@

# Use Set-Content which works more reliably in PowerShell 7
$extensionsConfig | Set-Content -Path $ICA_EXTENSIONS -Encoding UTF8 -NoNewline
if (-not (Test-Path $ICA_EXTENSIONS)) {
    Write-Host "    ERROR: Failed to create extensions config file" -ForegroundColor Red
    Write-Host "    Attempting alternative method..." -ForegroundColor Yellow
    # Fallback: try writing line by line
    "[ ica_ext ]" | Out-File -FilePath $ICA_EXTENSIONS -Encoding utf8
    "basicConstraints = critical, CA:TRUE, pathlen:0" | Out-File -FilePath $ICA_EXTENSIONS -Encoding utf8 -Append
    "keyUsage = critical, keyCertSign, cRLSign, digitalSignature" | Out-File -FilePath $ICA_EXTENSIONS -Encoding utf8 -Append
    "extendedKeyUsage = clientAuth" | Out-File -FilePath $ICA_EXTENSIONS -Encoding utf8 -Append
    "subjectKeyIdentifier = hash" | Out-File -FilePath $ICA_EXTENSIONS -Encoding utf8 -Append
    "authorityKeyIdentifier = keyid:always, issuer:always" | Out-File -FilePath $ICA_EXTENSIONS -Encoding utf8 -Append
}
if (Test-Path $ICA_EXTENSIONS) {
    Write-Host "    SUCCESS: Extensions config created: $ICA_EXTENSIONS" -ForegroundColor Gray
} else {
    Write-Host "    ERROR: Failed to create extensions config file!" -ForegroundColor Red
    exit 1
}

# Sign the CSR using -force_pubkey to use the fixed public key
# This replaces the public key in the CSR with our named-curve-encoded version
Write-Host "Signing CSR with fixed named curve encoding..." -ForegroundColor Green
& openssl x509 -req -in $CSR_FILE -CA $ROOT_CA_CERT -CAkey $ROOT_CA_KEY `
    -CAcreateserial -out $ICA_CERT -days 1825 -sha384 `
    -extfile $ICA_EXTENSIONS -extensions ica_ext `
    -force_pubkey $CSR_PUBKEY_FIXED 2>$null

if (-not (Test-Path $ICA_CERT)) {
    Write-Host "    ERROR: Failed to create ICA certificate" -ForegroundColor Red
    exit 1
}

# Verify the ICA certificate has named curve encoding
Write-Host "    Verifying ICA certificate EC encoding..." -ForegroundColor Gray
$icaKeyInfo = & openssl x509 -in $ICA_CERT -noout -text 2>&1 | Select-String -Pattern "ASN1 OID:|NIST CURVE:|P-384|P-256|secp384r1|secp256r1"
if ($icaKeyInfo) {
    Write-Host "    SUCCESS: ICA certificate EC key: $($icaKeyInfo -join ', ')" -ForegroundColor Gray
}

Write-Host "    SUCCESS: ICA certificate created with named curve encoding: $ICA_CERT" -ForegroundColor Gray

# Cleanup temporary files
if (Test-Path $CSR_PUBKEY) { Remove-Item $CSR_PUBKEY -Force -ErrorAction SilentlyContinue }
if ($useFixedKey -and (Test-Path $CSR_PUBKEY_FIXED)) { Remove-Item $CSR_PUBKEY_FIXED -Force -ErrorAction SilentlyContinue }

# Build certificate chain (ICA + Root CA)
Write-Host "Building certificate chain..." -ForegroundColor Green
$icaCert = Get-Content -Path $ICA_CERT -Raw
$rootCaCert = Get-Content -Path $ROOT_CA_CERT -Raw

# Ensure proper formatting with newlines
$certificateChain = $icaCert.Trim() + "`n" + $rootCaCert.Trim() + "`n"
[System.IO.File]::WriteAllText($CERT_CHAIN, $certificateChain)
Write-Host "    SUCCESS: Certificate chain saved to: $CERT_CHAIN" -ForegroundColor Gray


```

## Run the script

In the directory where your files are located, run the following command.

```powershell
.\selfsign.ps1
```

The script generates a signed certificate chain file called *byor-certificate-chain.pem*. 

## Upload the signed CSR

Upload the generated file into your external root CA in the Device Registry.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open your **Azure Device Registry** namespace.

1. In the sidebar menu, under **Namespace resources**, select **Credential Policies**.

1. Select your external root CA, then select the **Pending activation** link.

1. On the **Upload Certificate** page, use the file browser to select *byor-certificate-chain.pem*. Once completed, activate the policy.

