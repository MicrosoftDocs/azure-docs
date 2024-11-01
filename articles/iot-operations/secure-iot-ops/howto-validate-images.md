---
title: Validate images
description: Validate that Azure IoT Operations docker and helm images are legitimate.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 11/01/2024

#CustomerIntent: As an IT professional, I want to ensure that the images I download for Azure IoT Operations are legitimate.
---

# Validate image signing

Azure IoT Operations signs its docker and helm images to allow users to verify the integrity and origin of the images they use. Signing utilizes a public/private key pair to prove that Microsoft built a container image by creating a digital signature and adding it to the image. This article provides the steps to verify that an image was signed by Microsoft.

1. Download Notation.

   ```sh
   export NOTATION_VERSION=1.1.0
   curl -LO https://github.com/notaryproject/notation/releases/download/v$NOTATION_VERSION/notation_$NOTATION_VERSION\_linux_amd64.tar.gz
   sudo tar xvzf notation_1.1.0_linux_amd64.tar.gz -C /usr/bin/ notation
   ```

1. Download the Microsoft signing public certificate: `https://www.microsoft.com/pkiops/certs/Microsoft%20Supply%20Chain%20RSA%20Root%20CA%202022.crt`.

   Make sure it's saved as `msft_signing_cert.crt`.

1. Add the certificate to notation cli.

   ```sh
   notation cert add --type ca --store supplychain msft_signing_cert.crt
   ```

1. Check the certificate in notation.

   ```sh 
   notation cert ls
   ```   

   The output of the command looks like the following example:

   ```output
   STORE TYPE  STORE NAME  CERTIFICATE 
   ca          supplychain msft_signing_cert.crt
   ```

1. Create a trustpolicy file with your image scope.

   ```json
   {
       "version": "1.0",
       "trustPolicies": [
           {
               "name": "supplychain",
               "registryScopes": [ "*" ],
               "signatureVerification": {
                   "level" : "strict" 
               },
               "trustStores": [ "ca:supplychain" ],
               "trustedIdentities": [
                   "x509.subject: CN=Azure IoT Operations,O=Microsoft Corporation,L=Redmond,ST=Washington,C=US",
                   "x509.subject: CN=Microsoft SCD Products RSA Signing,O=Microsoft Corporation,L=Redmond,ST=Washington,C=US"
               ]
           }
       ]
   }
   ```

   * We allow all registryScopes to avoid listing every image that is bundled with Azure IoT Operations and to avoid future modifications.
   * `CN=Azure IoT Operations` covers all Azure IoT Operations images. However, other Microsoft images need `CN=Microsoft SCD Products RSA Signing`.

1. Use notation to verify your downloaded images against the trustpolicy.

   Replace the version placeholder with the version number of the image that you want to check. For an existing instance of Azure IoT Operations, you can find the version number on the instance overview page in the Azure portal or by running [az iot ops show](/cli/azure/iot/ops#az-iot-ops-show). For a full list of available versions, see [azure-iot-operations releases](https://github.com/Azure/azure-iot-operations/releases).

   ```sh
   notation policy import <TRUSTPOLICY_FILE>.json
   export NOTATION_EXPERIMENTAL=1
   notation verify --allow-referrers-api mcr.microsoft.com/azureiotoperations/aio-operator:<AZURE_IOT_OPERATIONS_VERSION>
   ```

   The output of the command looks like the following example:

   ```output
   Successfully verified signature for mcr.microsoft.com/azureiotoperations/aio-operator@sha256:09cbca56a2149d624cdc4ec952abe9a92ee88c347790c6657e3dd2a0fcc12d10
   ```
