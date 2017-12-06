## Create a project .ZIP file

Create a ZIP archive of everything in your project. The commands below use the default tool in your terminal:

```
# Bash
zip -r myAppFiles .

# PowerShell
Compress-Archive -Path * -DestinationPath myAppFiles.zip
``` 

Later, you will upload this .ZIP file to Azure and deploy it to App Service later.