



From: https://github.com/Azure/azure-cli/issues/19882

show-shared isn't covered in the docs - need to play with this to see and talk to the PM


az sig show-community

az sig image-definition show-community

az sig image-version show-community

sig image-definition list-community

sig image-version list-community



sig image-definition list-community

List VM Image definitions in a gallery community (preview).
List VM Image definitions in a gallery community (private preview feature, please contact community image gallery team by email sigpmdev@microsoft.com to register for preview if you're interested in using this feature).

examples: List the image definitions in a community gallery.
    
```azurecli-interactive
az sig image-definition list-community --public-gallery-name publicGalleryName --location myLocation
```


----------------


sig image-version list-community
type: command
short-summary: List VM Image Versions in a gallery community (preview).
long-summary: List VM Image Versions in a gallery community (private preview feature, please contact community image gallery team by email sigpmdev@microsoft.com to register for preview if you're interested in using this feature).
examples:
  - name: List an image versions in a gallery community.
    text: |
        az sig image-version list-community --public-gallery-name publicGalleryName \\
        --gallery-image-definition MyImage --location myLocation


-------------------

sig share enable-community
type: command
short-summary: Allow to share gallery to the community
examples:
  - name: Allow to share gallery to the community
    text: |
        az sig share enable-community --resource-group MyResourceGroup --gallery-name MyGallery


--------------------

    gallery_image_name_type = CLIArgumentType(options_list=['--gallery-image-definition', '-i'], help='The name of the community gallery image definition from which the image versions are to be listed.', id_part='child_name_2')
    gallery_image_name_version_type = CLIArgumentType(options_list=['--gallery-image-version', '-e'], help='The name of the gallery image version to be created. Needs to follow semantic version name pattern: The allowed characters are digit and period. Digits must be within the range of a 32-bit integer. Format: <MajorVersion>.<MinorVersion>.<Patch>', id_part='child_name_3')
    public_gallery_name_type = CLIArgumentType(help='The public name of community gallery.', id_part='child_name_1')



-----------------------


