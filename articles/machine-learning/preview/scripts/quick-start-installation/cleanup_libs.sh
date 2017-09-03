# cleanup_libs.sh
# Copyright (c) Microsoft. All rights reserved.

# Uninstalling all Azure CLI Commands 
pip uninstall -y $(pip freeze | grep azure-) && pip uninstall -y azure-