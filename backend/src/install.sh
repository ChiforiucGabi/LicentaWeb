#!/bin/bash

ansible_version=$(ansible --version 2> /dev/null)
hosts_file_name="my_hosts"
hosts_text1='[slaves]\n'$1'\n\n[slaves:vars]\nansible_python_interpreter=/usr/bin/python3\n\n'
hosts_text2="localhost ansible_connection=ssh ansible_ssh_user=admin ansible_ssh_pass=admin"

run_playbook='ansible-playbook final.yml -i my_hosts -l slaves -b'

if [ ! -n "$1" ]
then
	echo "You need to give IP address of slave as parameter!"
else
	if [ ! -n "$ansible_version" ]
	then
		echo "Ansible needs to be installed first!"
	else
		echo "Ansible is installed. Running the playbook now ..."
		if [ -f "$hosts_file_name" ] ; then
		    rm "$hosts_file_name"
		fi

		printf $hosts_text1>>my_hosts
		echo $hosts_text2>>my_hosts
		
		$run_playbook
	fi
fi