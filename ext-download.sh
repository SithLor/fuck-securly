#!/bin/bash

# Create a directory named "reverse_engineering_sec"
mkdir reverse_engineering_sec

# Change to the directory "reverse_engineering_sec"
cd reverse_engineering_sec


# Download the files using wget

wget https://extensions.securly.com/extensions.xml
wget https://extensions.securly.com/crextn_client_think_twice_2.98.0.0.crx
wget https://extensions.securly.com/chrome_browser_think_twice_2.98.0.0.crx
wget https://extensions.securly.com/edge_browser_think_twice_2.98.0.0.crx
wget https://extensions.securly.com/crextn_client_MV3_2.98.0.0.crx
wget https://extensions.securly.com/chrome_browser_production_2.98.56.crx
wget https://extensions.securly.com/crextn_client_production_2.98.55.0.crx
wget https://extensions.securly.com/crextn_client_beta_2.98.50.0.crx
wget https://extensions.securly.com/chrome_browser_beta_2.98.50.0.crx
wget https://extensions.securly.com/edge_browser_beta_2.98.56.0.crx
wget https://extensions.securly.com/crextn_client_FILTER-3880_beta_2.98.61.0.crx
wget https://extensions.securly.com/edge_browser_FILTER-3880_beta_2.98.61.0.crx
wget https://extensions.securly.com/chrome_browser_windows_FILTER-3880_beta_2.98.61.0.crx

# Unzip the downloaded files
unzip crextn_client_think_twice_2.98.0.0.crx -d crextn_client_think_twice_2.98.0.0
unzip chrome_browser_think_twice_2.98.0.0.crx -d chrome_browser_think_twice_2.98.0.0
unzip edge_browser_think_twice_2.98.0.0.crx -d edge_browser_think_twice_2.98.0.0
unzip crextn_client_MV3_2.98.0.0.crx -d crextn_client_MV3_2.98.0.0
unzip chrome_browser_production_2.98.56.crx -d chrome_browser_production_2.98.56
unzip crextn_client_production_2.98.55.0.crx -d crextn_client_production_2.98.55.0
unzip crextn_client_beta_2.98.50.0.crx -d crextn_client_beta_2.98.50.0
unzip chrome_browser_beta_2.98.50.0.crx -d chrome_browser_beta_2.98.50.0
unzip edge_browser_beta_2.98.56.0.crx -d edge_browser_beta_2.98.56.0
unzip crextn_client_FILTER-3880_beta_2.98.61.0.crx -d crextn_client_FILTER-3880_beta_2.98.61.0
unzip edge_browser_FILTER-3880_beta_2.98.61.0.crx -d edge_browser_FILTER-3880_beta_2.98.61.0
unzip chrome_browser_windows_FILTER-3880_beta_2.98.61.0.crx -d chrome_browser_windows_FILTER-3880_beta_2.98.61.0