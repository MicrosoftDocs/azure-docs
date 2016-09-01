# Running the Sample Application for Key Vault #

## Donwload & Preparation ##

Download the Azure Key Vault client samples from [this](https://www.microsoft.com/en-us/download/details.aspx?id=45343) link.

Extract the contents of the zip file to your local computer.

Read the **README.md** file (this is a text file) and follow the instructions.

## Running Sample #1 - HelloKeyVault
*HelloKeyVault* is a console application that walks through the key scenarios supported by Key Vault:

  1. Create/Import a key (HSM or software keys)
  2. Encrypt a secret using a content key
  3. Wrap the content key using a Key Vault key
  4. Unwrap the content key
  5. Decrypt the secret
  6. Set a secret

That console application should run with no changes except for updating the appropriate configuration settings in App.Config per the below steps:

1. Update the app configuration settings in HelloKeyVault\App.config with your vault URL, application principal ID and secret. The information can optionally be generated using *scripts\GetAppConfigSettings.ps1*. To use the sample script, follow these steps:
2. Update the values of mandatory variables in GetAppConfigSettings.ps1
3. Launch the Microsoft Azure PowerShell window
4. Run the GetAppConfigSettings.ps1 script within the Microsoft Azure PowerShell window
5. Copy the results of the script into the HelloKeyVault\App.config file
