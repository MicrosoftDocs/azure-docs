# cleanup_old_vienna_runs.ps1
# Copyright (c) Microsoft. All rights reserved.

# This script cleans up some temporary data created by 
# older builds of vienna ( Older than August 16, 2017),
# before the "clean" command was implemented.
#
# It is not necessary on newer versions.
#
# Usage:
# 
#.\cleanup.ps1  <-force> 
# 
# The script checks for directories in temp that "look like" azureml runs.
# By default, it deletes them interactively, use the -force option to
# delete with out prompting.

param (
    [switch]$force = $false
)


function HasAmlDir($path)
{
    $aml_config_path = join-path $path -ChildPath "aml_config"

    Test-Path $aml_config_path


}


Get-ChildItem -Directory $env:temp | ForEach-Object {
    $full_path = join-path $env:temp -ChildPath $_

    if ( hasAMLDir($full_path) ) 
    {
        echo "Removing directory $full_path"
        if ($force)
        {        
            rm -r $full_path
        }
        else
        {
            rm $full_path
        }
    }

}








