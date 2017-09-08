# cleanup_libs.ps1
# Copyright (c) Microsoft. All rights reserved.

# This need to be run as an administrator...
# Uninstalling all Azure CLI Commands 
pip freeze | Select-String -SimpleMatch ("azure-") | % {pip uninstall $_ --yes}