# Define parameters


# Get the VM
$vm = Get-AzVM -ResourceGroupName test-rg -Name vm-nva

# Get the NIC
$nic = Get-AzNetworkInterface -ResourceGroupName test-rg -Name nic-public

# Set the NIC as primary
$vm.NetworkProfile.NetworkInterfaces | ForEach-Object {
    $_.Primary = $false
}
$vm.NetworkProfile.NetworkInterfaces | Where-Object { $_.Id -eq $nic.Id } | ForEach-Object {
    $_.Primary = $true
}

# Update the VM
Update-AzVM -ResourceGroupName test-rg -VM $vm
