# cleanup_mac.sh
# Copyright (c) Microsoft. All rights reserved.

killall AmlWorkbench
sudo rm -rf /Applications/AmlWorkbench.app/
sudo rm -rf ~/Library/Caches/AmlWorkbench
sudo rm -rf ~/Library/Application\ Support/AmlWorkbench/