import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// --- Shared Components ---

const Header = ({ title, onBackPress }) => (
  <View style={sharedStyles.headerContainer}>
    {onBackPress && (
      <TouchableOpacity onPress={onBackPress} style={sharedStyles.backButton}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
    )}
    <Text style={sharedStyles.headerTitle}>{title}</Text>
  </View>
);

const SummaryCard = ({ title, value, icon }) => (
  <View style={sharedStyles.summaryCard}>
    <Icon name={icon} size={28} color="#4CAF50" />
    <Text style={sharedStyles.summaryCardTitle}>{title}</Text>
    <Text style={sharedStyles.summaryCardValue}>{value}</Text>
  </View>
);

const CustomButton = ({ label, onPress, style, textStyle, icon, iconColor }) => (
  <TouchableOpacity style={[sharedStyles.button, style]} onPress={onPress}>
    {icon && <Icon name={icon} size={20} color={iconColor || '#fff'} style={sharedStyles.buttonIcon} />}
    <Text style={[sharedStyles.buttonText, textStyle]}>{label}</Text>
  </TouchableOpacity>
);

const SearchBar = ({ placeholder, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  return (
    <View style={sharedStyles.searchBarContainer}>
      <Icon name="search" size={20} color="#888" style={sharedStyles.searchIcon} />
      <TextInput
        style={sharedStyles.searchInput}
        placeholder={placeholder}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={() => onSearch(searchText)}
        placeholderTextColor="#aaa"
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={() => { setSearchText(''); onSearch(''); }}>
          <Icon name="close-circle" size={20} color="#888" style={sharedStyles.clearSearchIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const List = ({ items, renderItem, style }) => (
  <View style={[sharedStyles.listContainer, style]}>
    {items.map((item, index) => (renderItem(item, index)))} 
  </View>
);

const TextInputField = ({ label, value, onChangeText, placeholder, secureTextEntry, inputType = 'default' }) => (
  <View style={sharedStyles.formGroup}>
    {label && <Text style={sharedStyles.formLabel}>{label}</Text>}
    <TextInput
      style={sharedStyles.textInputField}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={inputType === 'email' ? 'email-address' : inputType}
      placeholderTextColor="#aaa"
    />
  </View>
);

const TextAreaField = ({ label, value, onChangeText, placeholder }) => (
  <View style={sharedStyles.formGroup}>
    {label && <Text style={sharedStyles.formLabel}>{label}</Text>}
    <TextInput
      style={sharedStyles.textAreaField}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline
      numberOfLines={4}
      placeholderTextColor="#aaa"
    />
  </View>
);

const SelectField = ({ label, value, onValueChange, options, placeholder }) => (
  <View style={sharedStyles.formGroup}>
    {label && <Text style={sharedStyles.formLabel}>{label}</Text>}
    <View style={sharedStyles.selectContainer}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={sharedStyles.pickerStyle}
        itemStyle={sharedStyles.pickerItemStyle}
      >
        {placeholder && <Picker.Item label={placeholder} value="" enabled={false} color="#aaa" />}
        {options.map((option, index) => (
          <Picker.Item key={index} label={option.label} value={option.value} />
        ))}
      </Picker>
      <Icon name="caret-down-outline" size={18} color="#666" style={sharedStyles.pickerIcon} />
    </View>
  </View>
);

const MultiSelectField = ({ label, selectedOptions, onToggleOption, options, placeholder }) => {
  const [showOptions, setShowOptions] = useState(false);
  const displayValue = selectedOptions.map(id => options.find(o => o.value === id)?.label || '').join(', ');

  return (
    <View style={sharedStyles.formGroup}>
      {label && <Text style={sharedStyles.formLabel}>{label}</Text>}
      <TouchableOpacity style={sharedStyles.multiSelectTrigger} onPress={() => setShowOptions(!showOptions)}>
        <Text style={sharedStyles.multiSelectValue}>{displayValue || placeholder}</Text>
        <Icon name={showOptions ? "caret-up-outline" : "caret-down-outline"} size={18} color="#666" />
      </TouchableOpacity>
      {showOptions && (
        <View style={sharedStyles.multiSelectOptionsContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={sharedStyles.multiSelectOption}
              onPress={() => onToggleOption(option.value)}
            >
              <Icon
                name={selectedOptions.includes(option.value) ? "checkbox-outline" : "square-outline"}
                size={20}
                color="#4CAF50"
              />
              <Text style={sharedStyles.multiSelectOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const DatePickerField = ({ label, value, onDateChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const formattedDate = value ? new Date(value).toLocaleDateString() : '';

  const handleConfirm = (date) => {
    onDateChange(date.toISOString());
    setDatePickerVisibility(false);
  };

  return (
    <View style={sharedStyles.formGroup}>
      {label && <Text style={sharedStyles.formLabel}>{label}</Text>}
      <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={sharedStyles.datePickerButton}>
        <Text style={sharedStyles.datePickerText}>{formattedDate || 'Select Date'}</Text>
        <Icon name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
        date={value ? new Date(value) : new Date()}
      />
    </View>
  );
};

const FileUploadField = ({ label, onFileSelect }) => (
  <View style={sharedStyles.formGroup}>
    {label && <Text style={sharedStyles.formLabel}>{label}</Text>}
    <CustomButton label="Upload File" onPress={() => alert('File upload functionality pending')} icon="cloud-upload-outline" iconColor="#fff" />
  </View>
);

const Avatar = ({ uri, size = 'medium' }) => {
  const avatarSize = size === 'large' ? 80 : (size === 'medium' ? 50 : 30);
  return (
    <Image
      source={uri ? { uri } : require('../assets/default-avatar.png')}
      style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, backgroundColor: '#eee' }}
    />
  );
};

const StatusBadge = ({ label, value }) => {
  const getBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'active': case 'completed': case 'inProgress':
        return { backgroundColor: '#4CAF50' }; // Green
      case 'pending': case 'onhold':
        return { backgroundColor: '#FFC107' }; // Yellow
      case 'blocked':
        return { backgroundColor: '#F44336' }; // Red
      default:
        return { backgroundColor: '#9E9E9E' }; // Grey
    }
  };
  return (
    <View style={[sharedStyles.statusBadge, getBadgeStyle(value)]}>
      <Text style={sharedStyles.statusBadgeText}>{label}: {value}</Text>
    </View>
  );
};

// Specific List Item Renderers
const TeamListItem = ({ team, onPress }) => (
  <TouchableOpacity style={sharedStyles.listItem} onPress={onPress}>
    <Icon name="people-outline" size={24} color="#3F51B5" />
    <View style={sharedStyles.listItemContent}>
      <Text style={sharedStyles.listItemTitle}>{team.name}</Text>
      <Text style={sharedStyles.listItemSubtitle}>{team.memberCount || team.members?.length || 0} Members</Text>
    </View>
    <Icon name="chevron-forward-outline" size={20} color="#888" />
  </TouchableOpacity>
);

const MemberListItem = ({ member, onPress }) => (
  <TouchableOpacity style={sharedStyles.listItem} onPress={onPress}>
    <Avatar uri={member.profilePictureUrl} size="small" />
    <View style={sharedStyles.listItemContent}>
      <Text style={sharedStyles.listItemTitle}>{member.name}</Text>
      <Text style={sharedStyles.listItemSubtitle}>{member.email} - {member.role}</Text>
    </View>
    <Icon name="chevron-forward-outline" size={20} color="#888" />
  </TouchableOpacity>
);

const ProjectListItem = ({ project, onPress }) => (
  <TouchableOpacity style={sharedStyles.listItem} onPress={onPress}>
    <Icon name="briefcase-outline" size={24} color="#FF9800" />
    <View style={sharedStyles.listItemContent}>
      <Text style={sharedStyles.listItemTitle}>{project.name}</Text>
      <Text style={sharedStyles.listItemSubtitle}>{project.team} - Due: {new Date(project.dueDate).toLocaleDateString()}</Text>
      <StatusBadge value={project.status} label="Status" />
    </View>
    <Icon name="chevron-forward-outline" size={20} color="#888" />
  </TouchableOpacity>
);

const TaskListItem = ({ task, onPress }) => (
  <TouchableOpacity style={sharedStyles.listItem} onPress={onPress}>
    <Icon name="checkbox-outline" size={24} color="#2196F3" />
    <View style={sharedStyles.listItemContent}>
      <Text style={sharedStyles.listItemTitle}>{task.name}</Text>
      <Text style={sharedStyles.listItemSubtitle}>Due: {new Date(task.dueDate).toLocaleDateString()} - {task.status}</Text>
    </View>
    <Icon name="chevron-forward-outline" size={20} color="#888" />
  </TouchableOpacity>
);

// Specific Lists
const MemberList = ({ title, members, onMemberPress }) => (
  <View style={sharedStyles.sectionContainer}>
    <Text style={sharedStyles.sectionTitle}>{title}</Text>
    <List
      items={members}
      renderItem={(member) => <MemberListItem key={member.id} member={member} onPress={() => onMemberPress(member.id)} />}
    />
  </View>
);

const ProjectList = ({ title, projects, onProjectPress }) => (
  <View style={sharedStyles.sectionContainer}>
    <Text style={sharedStyles.sectionTitle}>{title}</Text>
    <List
      items={projects}
      renderItem={(project) => <ProjectListItem key={project.id} project={project} onPress={() => onProjectPress(project.id)} />}
    />
  </View>
);

const TaskList = ({ title, tasks, onTaskPress }) => (
  <View style={sharedStyles.sectionContainer}>
    <Text style={sharedStyles.sectionTitle}>{title}</Text>
    <List
      items={tasks}
      renderItem={(task) => <TaskListItem key={task.id} task={task} onPress={() => onTaskPress(task.id)} />}
    />
  </View>
);

const MemberAvatarList = ({ title, members }) => (
  <View style={sharedStyles.sectionContainer}>
    <Text style={sharedStyles.sectionTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sharedStyles.avatarListContainer}>
      {members.map(member => (
        <View key={member.id} style={sharedStyles.avatarItem}>
          <Avatar uri={member.profilePictureUrl} size="medium" />
          <Text style={sharedStyles.avatarName}>{member.name.split(' ')[0]}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

// --- Screens ---

export const DashboardScreen = ({ navigation }) => {
  const recentActivities = [
    "Task completed by John Doe",
    "New project 'Website Redesign' created",
    "Team 'Marketing' updated",
    "Member Jane Smith added to 'Sales' team"
  ];

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title="Dashboard" />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <View style={dashboardStyles.summaryCardsContainer}>
          <SummaryCard title="Active Projects" value="5" icon="briefcase-outline" />
          <SummaryCard title="Pending Tasks" value="12" icon="checkmark-circle-outline" />
          <SummaryCard title="Team Members" value="25" icon="people-outline" />
        </View>

        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.sectionTitle}>Recent Activities</Text>
          <View style={dashboardStyles.activityList}>
            {recentActivities.map((activity, index) => (
              <View key={index} style={dashboardStyles.activityItem}>
                <Icon name="information-circle-outline" size={18} color="#666" style={{ marginRight: 10 }} />
                <Text style={dashboardStyles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const TeamsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]); // Placeholder for actual data

  // Mock data for demonstration
  React.useEffect(() => {
    // In a real app, this would fetch from an API
    setTeams([
      { id: 't1', name: 'Marketing Team', memberCount: 8, members: ['m1','m2'] },
      { id: 't2', name: 'Development Team', memberCount: 15, members: ['m3','m4'] },
      { id: 't3', name: 'Sales Team', memberCount: 7, members: ['m5','m6'] },
    ]);
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title="Teams" />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <CustomButton
          label="Add New Team"
          onPress={() => navigation.navigate('TeamForm')}
          style={{ marginBottom: 15 }}
          icon="add-circle-outline"
        />
        <SearchBar placeholder="Search teams..." onSearch={setSearchQuery} />
        <List
          items={filteredTeams}
          renderItem={(item) => (
            <TeamListItem
              key={item.id}
              team={item}
              onPress={() => navigation.navigate('TeamDetails', { teamId: item.id })}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export const TeamDetailsScreen = ({ route, navigation }) => {
  const { teamId } = route.params;
  const [team, setTeam] = useState(null); // Placeholder for actual team data

  React.useEffect(() => {
    // Fetch team details based on teamId
    // For demo, find from mock data
    const mockTeams = [
      { id: 't1', name: 'Marketing Team', description: 'Handles all marketing campaigns.', members: [{id: 'm1', name: 'John Doe'}], projects: [{id: 'p1', name: 'Website Redesign'}] },
      { id: 't2', name: 'Development Team', description: 'Focuses on software and app development.', members: [{id: 'm3', name: 'Jane Smith'}], projects: [{id: 'p2', name: 'Mobile App'}] },
    ];
    setTeam(mockTeams.find(t => t.id === teamId));
  }, [teamId]);

  if (!team) {
    return (
      <SafeAreaView style={screenStyles.container}>
        <Header title="Team Details" onBackPress={() => navigation.goBack()} />
        <View style={screenStyles.loadingContainer}><Text>Loading team details...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title="Team Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <View style={teamDetailsStyles.detailSection}>
          <Text style={teamDetailsStyles.label}>Team Name:</Text>
          <Text style={teamDetailsStyles.value}>{team.name}</Text>
        </View>
        {team.description && (
          <View style={teamDetailsStyles.detailSection}>
            <Text style={teamDetailsStyles.label}>Description:</Text>
            <Text style={teamDetailsStyles.value}>{team.description}</Text>
          </View>
        )}

        <MemberList
          title="Members"
          members={team.members}
          onMemberPress={(memberId) => navigation.navigate('MemberDetails', { memberId })}
        />

        <ProjectList
          title="Projects"
          projects={team.projects}
          onProjectPress={(projectId) => navigation.navigate('ProjectDetails', { projectId })}
        />

        <CustomButton
          label="Edit Team"
          onPress={() => navigation.navigate('TeamForm', { mode: 'edit', teamId: team.id })}
          style={{ marginTop: 20 }}
          icon="pencil-outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export const TeamFormScreen = ({ route, navigation }) => {
  const { mode, teamId } = route.params || {}; // mode can be 'edit' or undefined (for create)
  const isEditMode = mode === 'edit';
  const [form, setForm] = useState({
    teamName: '',
    teamDescription: '',
    teamMembers: [], // Array of member IDs
  });

  const allMembersOptions = [
    { label: 'John Doe', value: 'm1' },
    { label: 'Jane Smith', value: 'm2' },
    { label: 'Mike Johnson', value: 'm3' },
  ]; // Placeholder for all members

  React.useEffect(() => {
    if (isEditMode && teamId) {
      // Fetch existing team data and populate form
      const existingTeam = { id: 't1', name: 'Marketing Team', description: 'Existing description.', members: ['m1'] };
      setForm({
        teamName: existingTeam.name,
        teamDescription: existingTeam.description,
        teamMembers: existingTeam.members,
      });
    }
  }, [isEditMode, teamId]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleToggleMember = (memberId) => {
    const currentMembers = form.teamMembers;
    if (currentMembers.includes(memberId)) {
      handleChange('teamMembers', currentMembers.filter(id => id !== memberId));
    } else {
      handleChange('teamMembers', [...currentMembers, memberId]);
    }
  };

  const handleSubmit = () => {
    console.log('Form Submitted:', form);
    alert(isEditMode ? 'Team Updated!' : 'Team Created!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title={isEditMode ? "Edit Team" : "Create Team"} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <TextInputField
          label="Team Name"
          value={form.teamName}
          onChangeText={(text) => handleChange('teamName', text)}
          placeholder="e.g., Marketing Team"
        />
        <TextAreaField
          label="Description"
          value={form.teamDescription}
          onChangeText={(text) => handleChange('teamDescription', text)}
          placeholder="Describe the team's purpose..."
        />
        <MultiSelectField
          label="Members"
          selectedOptions={form.teamMembers}
          onToggleOption={handleToggleMember}
          options={allMembersOptions}
          placeholder="Select members"
        />
        <CustomButton label="Save Team" onPress={handleSubmit} style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export const MembersScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]); // Placeholder for actual data

  // Mock data for demonstration
  React.useEffect(() => {
    setMembers([
      { id: 'm1', name: 'John Doe', email: 'john.doe@example.com', role: 'member', profilePictureUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=JD' },
      { id: 'm2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'manager', profilePictureUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=JS' },
      { id: 'm3', name: 'Mike Johnson', email: 'mike.j@example.com', role: 'admin', profilePictureUrl: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=MJ' },
    ]);
  }, []);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title="Members" />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <CustomButton
          label="Add New Member"
          onPress={() => navigation.navigate('MemberForm')}
          style={{ marginBottom: 15 }}
          icon="person-add-outline"
        />
        <SearchBar placeholder="Search members..." onSearch={setSearchQuery} />
        <List
          items={filteredMembers}
          renderItem={(item) => (
            <MemberListItem
              key={item.id}
              member={item}
              onPress={() => navigation.navigate('MemberDetails', { memberId: item.id })}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export const MemberDetailsScreen = ({ route, navigation }) => {
  const { memberId } = route.params;
  const [member, setMember] = useState(null); // Placeholder for actual member data

  React.useEffect(() => {
    const mockMembers = [
      { id: 'm1', name: 'John Doe', email: 'john.doe@example.com', role: 'member', profilePictureUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=JD', teams: ['Marketing Team'], activeProjects: ['Website Redesign'] },
      { id: 'm2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'manager', profilePictureUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=JS', teams: ['Development Team'], activeProjects: ['Mobile App'] },
    ];
    setMember(mockMembers.find(m => m.id === memberId));
  }, [memberId]);

  if (!member) {
    return (
      <SafeAreaView style={screenStyles.container}>
        <Header title="Member Details" onBackPress={() => navigation.goBack()} />
        <View style={screenStyles.loadingContainer}><Text>Loading member details...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title="Member Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <View style={memberDetailsStyles.avatarContainer}>
          <Avatar uri={member.profilePictureUrl} size="large" />
        </View>
        <View style={memberDetailsStyles.detailSection}>
          <Text style={memberDetailsStyles.label}>Name:</Text>
          <Text style={memberDetailsStyles.value}>{member.name}</Text>
        </View>
        <View style={memberDetailsStyles.detailSection}>
          <Text style={memberDetailsStyles.label}>Email:</Text>
          <Text style={memberDetailsStyles.value}>{member.email}</Text>
        </View>
        <View style={memberDetailsStyles.detailSection}>
          <Text style={memberDetailsStyles.label}>Role:</Text>
          <Text style={memberDetailsStyles.value}>{member.role}</Text>
        </View>
        <View style={memberDetailsStyles.detailSection}>
          <Text style={memberDetailsStyles.label}>Teams:</Text>
          <Text style={memberDetailsStyles.value}>{member.teams.join(', ')}</Text>
        </View>
        <View style={memberDetailsStyles.detailSection}>
          <Text style={memberDetailsStyles.label}>Active Projects:</Text>
          <Text style={memberDetailsStyles.value}>{member.activeProjects.join(', ')}</Text>
        </View>
        <CustomButton
          label="Edit Member"
          onPress={() => navigation.navigate('MemberForm', { mode: 'edit', memberId: member.id })}
          style={{ marginTop: 20 }}
          icon="pencil-outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export const MemberFormScreen = ({ route, navigation }) => {
  const { mode, memberId } = route.params || {};
  const isEditMode = mode === 'edit';
  const [form, setForm] = useState({
    memberName: '',
    memberEmail: '',
    memberRole: 'member',
    profilePicture: null, // Placeholder for file object/URI
  });

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'member', label: 'Member' },
  ];

  React.useEffect(() => {
    if (isEditMode && memberId) {
      const existingMember = { id: 'm1', name: 'John Doe', email: 'john.doe@example.com', role: 'member', profilePictureUrl: null };
      setForm({
        memberName: existingMember.name,
        memberEmail: existingMember.email,
        memberRole: existingMember.role,
        profilePicture: existingMember.profilePictureUrl,
      });
    }
  }, [isEditMode, memberId]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    console.log('Member Form Submitted:', form);
    alert(isEditMode ? 'Member Updated!' : 'Member Created!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title={isEditMode ? "Edit Member" : "Create Member"} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <TextInputField
          label="Name"
          value={form.memberName}
          onChangeText={(text) => handleChange('memberName', text)}
          placeholder="e.g., Jane Doe"
        />
        <TextInputField
          label="Email"
          value={form.memberEmail}
          onChangeText={(text) => handleChange('memberEmail', text)}
          inputType="email"
          placeholder="e.g., jane.doe@example.com"
        />
        <SelectField
          label="Role"
          value={form.memberRole}
          onValueChange={(value) => handleChange('memberRole', value)}
          options={roleOptions}
        />
        <FileUploadField
          label="Profile Picture"
          onFileSelect={(file) => handleChange('profilePicture', file)}
        />
        <CustomButton label="Save Member" onPress={handleSubmit} style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export const ProjectsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [projects, setProjects] = useState([]); // Placeholder for actual data

  // Mock data for demonstration
  React.useEffect(() => {
    setProjects([
      { id: 'p1', name: 'Website Redesign', team: 'Marketing Team', dueDate: '2023-12-31', status: 'active' },
      { id: 'p2', name: 'Mobile App Development', team: 'Development Team', dueDate: '2024-03-15', status: 'inProgress' },
      { id: 'p3', name: 'Q1 Sales Campaign', team: 'Sales Team', dueDate: '2023-09-30', status: 'completed' },
      { id: 'p4', name: 'Internal Tool Build', team: 'Development Team', dueDate: '2024-06-01', status: 'onHold' },
    ]);
  }, []);

  const statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'onHold' },
    { label: 'In Progress', value: 'inProgress' }, // Add 'inProgress' status for comprehensive filtering
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || project.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title="Projects" />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <CustomButton
          label="Add New Project"
          onPress={() => navigation.navigate('ProjectForm')}
          style={{ marginBottom: 15 }}
          icon="add-circle-outline"
        />
        <SearchBar placeholder="Search projects..." onSearch={setSearchQuery} />
        <SelectField
          label="Status Filter"
          value={filterStatus}
          onValueChange={setFilterStatus}
          options={statusOptions}
          placeholder="Filter by Status"
        />
        <List
          items={filteredProjects}
          renderItem={(item) => (
            <ProjectListItem
              key={item.id}
              project={item}
              onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export const ProjectDetailsScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null); // Placeholder for actual project data

  React.useEffect(() => {
    const mockProjects = [
      { id: 'p1', name: 'Website Redesign', description: 'Complete overhaul of the company website.', teamName: 'Marketing Team', teamId: 't1', dueDate: '2023-12-31', status: 'active', assignedMembers: [{id:'m1', name:'John Doe', profilePictureUrl:'https://via.placeholder.com/150/FF5733/FFFFFF?text=JD'}], tasks: [{id:'tk1', name:'Design UI Mockups', status:'inProgress'}] },
      { id: 'p2', name: 'Mobile App Development', description: 'Developing a new mobile application for iOS and Android.', teamName: 'Development Team', teamId: 't2', dueDate: '2024-03-15', status: 'inProgress', assignedMembers: [{id:'m2', name:'Jane Smith', profilePictureUrl:'https://via.placeholder.com/150/33FF57/FFFFFF?text=JS'}], tasks: [{id:'tk2', name:'Backend API Integration', status:'pending'}] },
    ];
    setProject(mockProjects.find(p => p.id === projectId));
  }, [projectId]);

  if (!project) {
    return (
      <SafeAreaView style={screenStyles.container}>
        <Header title="Project Details" onBackPress={() => navigation.goBack()} />
        <View style={screenStyles.loadingContainer}><Text>Loading project details...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title="Project Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <View style={sharedStyles.detailSection}>
          <Text style={sharedStyles.label}>Project Name:</Text>
          <Text style={sharedStyles.value}>{project.name}</Text>
        </View>
        <View style={sharedStyles.detailSection}>
          <Text style={sharedStyles.label}>Description:</Text>
          <Text style={sharedStyles.value}>{project.description}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('TeamDetails', { teamId: project.teamId })} style={sharedStyles.detailSectionWithAction}>
          <Text style={sharedStyles.label}>Team:</Text>
          <Text style={sharedStyles.value}>{project.teamName} <Icon name="open-outline" size={16} color="#007AFF" /></Text>
        </TouchableOpacity>
        <View style={sharedStyles.detailSection}>
          <Text style={sharedStyles.label}>Due Date:</Text>
          <Text style={sharedStyles.value}>{new Date(project.dueDate).toLocaleDateString()}</Text>
        </View>
        <StatusBadge label="Status" value={project.status} />

        <MemberAvatarList title="Assigned Members" members={project.assignedMembers} />

        <TaskList
          title="Tasks"
          tasks={project.tasks}
          onTaskPress={(taskId) => navigation.navigate('TaskDetails', { taskId, projectId: project.id })}
        />

        <CustomButton
          label="Add New Task"
          onPress={() => navigation.navigate('TaskForm', { projectId: project.id })}
          style={{ marginTop: 20, backgroundColor: '#007AFF' }}
          icon="add-outline"
        />
        <CustomButton
          label="Edit Project"
          onPress={() => navigation.navigate('ProjectForm', { mode: 'edit', projectId: project.id })}
          style={{ marginTop: 10 }}
          icon="pencil-outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export const ProjectFormScreen = ({ route, navigation }) => {
  const { mode, projectId } = route.params || {};
  const isEditMode = mode === 'edit';
  const [form, setForm] = useState({
    projectName: '',
    projectDescription: '',
    assignedTeam: '',
    dueDate: null,
    projectStatus: 'active',
    assignedMembers: [],
  });

  const allTeamsOptions = [
    { label: 'Marketing Team', value: 't1' },
    { label: 'Development Team', value: 't2' },
  ];
  const allMembersOptions = [
    { label: 'John Doe', value: 'm1' },
    { label: 'Jane Smith', value: 'm2' },
    { label: 'Mike Johnson', value: 'm3' },
  ];
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'onHold', label: 'On Hold' },
    { value: 'inProgress', label: 'In Progress' },
  ];

  React.useEffect(() => {
    if (isEditMode && projectId) {
      const existingProject = { id: 'p1', name: 'Website Redesign', description: 'Old description.', teamId: 't1', dueDate: '2023-12-31T00:00:00.000Z', status: 'active', assignedMembers: ['m1'] };
      setForm({
        projectName: existingProject.name,
        projectDescription: existingProject.description,
        assignedTeam: existingProject.teamId,
        dueDate: new Date(existingProject.dueDate),
        projectStatus: existingProject.status,
        assignedMembers: existingProject.assignedMembers,
      });
    }
  }, [isEditMode, projectId]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleToggleMember = (memberId) => {
    const currentMembers = form.assignedMembers;
    if (currentMembers.includes(memberId)) {
      handleChange('assignedMembers', currentMembers.filter(id => id !== memberId));
    } else {
      handleChange('assignedMembers', [...currentMembers, memberId]);
    }
  };

  const handleSubmit = () => {
    console.log('Project Form Submitted:', form);
    alert(isEditMode ? 'Project Updated!' : 'Project Created!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title={isEditMode ? "Edit Project" : "Create Project"} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <TextInputField
          label="Project Name"
          value={form.projectName}
          onChangeText={(text) => handleChange('projectName', text)}
          placeholder="e.g., Mobile App Development"
        />
        <TextAreaField
          label="Description"
          value={form.projectDescription}
          onChangeText={(text) => handleChange('projectDescription', text)}
          placeholder="Detailed project description..."
        />
        <SelectField
          label="Team"
          value={form.assignedTeam}
          onValueChange={(value) => handleChange('assignedTeam', value)}
          options={allTeamsOptions}
          placeholder="Select a team"
        />
        <DatePickerField
          label="Due Date"
          value={form.dueDate}
          onDateChange={(date) => handleChange('dueDate', date)}
        />
        <SelectField
          label="Status"
          value={form.projectStatus}
          onValueChange={(value) => handleChange('projectStatus', value)}
          options={statusOptions}
        />
        <MultiSelectField
          label="Assigned Members"
          selectedOptions={form.assignedMembers}
          onToggleOption={handleToggleMember}
          options={allMembersOptions}
          placeholder="Select members"
        />
        <CustomButton label="Save Project" onPress={handleSubmit} style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export const TaskDetailsScreen = ({ route, navigation }) => {
  const { taskId, projectId } = route.params;
  const [task, setTask] = useState(null); // Placeholder for actual task data

  React.useEffect(() => {
    const mockTasks = [
      { id: 'tk1', name: 'Design UI Mockups', description: 'Create wireframes and high-fidelity mockups.', projectId: 'p1', projectName: 'Website Redesign', assignedToId: 'm1', assignedMemberName: 'John Doe', dueDate: '2023-11-15', status: 'inProgress', priority: 'high' },
      { id: 'tk2', name: 'Backend API Integration', description: 'Integrate the mobile app with existing backend services.', projectId: 'p2', projectName: 'Mobile App Development', assignedToId: 'm2', assignedMemberName: 'Jane Smith', dueDate: '2024-02-01', status: 'pending', priority: 'medium' },
    ];
    setTask(mockTasks.find(t => t.id === taskId));
  }, [taskId]);

  if (!task) {
    return (
      <SafeAreaView style={screenStyles.container}>
        <Header title="Task Details" onBackPress={() => navigation.goBack()} />
        <View style={screenStyles.loadingContainer}><Text>Loading task details...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title="Task Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <View style={sharedStyles.detailSection}>
          <Text style={sharedStyles.label}>Task Name:</Text>
          <Text style={sharedStyles.value}>{task.name}</Text>
        </View>
        <View style={sharedStyles.detailSection}>
          <Text style={sharedStyles.label}>Description:</Text>
          <Text style={sharedStyles.value}>{task.description}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProjectDetails', { projectId: task.projectId })} style={sharedStyles.detailSectionWithAction}>
          <Text style={sharedStyles.label}>Project:</Text>
          <Text style={sharedStyles.value}>{task.projectName} <Icon name="open-outline" size={16} color="#007AFF" /></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => task.assignedToId && navigation.navigate('MemberDetails', { memberId: task.assignedToId })} style={sharedStyles.detailSectionWithAction}>
          <Text style={sharedStyles.label}>Assigned To:</Text>
          <Text style={sharedStyles.value}>{task.assignedMemberName || 'Unassigned'} {task.assignedToId && <Icon name="open-outline" size={16} color="#007AFF" />}</Text>
        </TouchableOpacity>
        <View style={sharedStyles.detailSection}>
          <Text style={sharedStyles.label}>Due Date:</Text>
          <Text style={sharedStyles.value}>{new Date(task.dueDate).toLocaleDateString()}</Text>
        </View>
        <StatusBadge label="Status" value={task.status} />
        <View style={sharedStyles.detailSection}>
          <Text style={sharedStyles.label}>Priority:</Text>
          <Text style={sharedStyles.value}>{task.priority}</Text>
        </View>
        <CustomButton
          label="Edit Task"
          onPress={() => navigation.navigate('TaskForm', { mode: 'edit', taskId: task.id, projectId: task.projectId })}
          style={{ marginTop: 20 }}
          icon="pencil-outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export const TaskFormScreen = ({ route, navigation }) => {
  const { mode, taskId, projectId } = route.params || {};
  const isEditMode = mode === 'edit';
  const [form, setForm] = useState({
    taskName: '',
    taskDescription: '',
    assignedTo: '',
    taskDueDate: null,
    taskStatus: 'pending',
    taskPriority: 'medium',
  });

  // For simplicity, projectMembers can be allMembers or filtered based on projectId in a real app
  const projectMembersOptions = [
    { label: 'John Doe', value: 'm1' },
    { label: 'Jane Smith', value: 'm2' },
    { label: 'Mike Johnson', value: 'm3' },
  ];
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'blocked', label: 'Blocked' },
  ];
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  React.useEffect(() => {
    if (isEditMode && taskId) {
      const existingTask = { id: 'tk1', name: 'Design UI Mockups', description: 'Existing desc.', assignedToId: 'm1', dueDate: '2023-11-15T00:00:00.000Z', status: 'inProgress', priority: 'high' };
      setForm({
        taskName: existingTask.name,
        taskDescription: existingTask.description,
        assignedTo: existingTask.assignedToId,
        taskDueDate: new Date(existingTask.dueDate),
        taskStatus: existingTask.status,
        taskPriority: existingTask.priority,
      });
    }
  }, [isEditMode, taskId]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    console.log('Task Form Submitted:', { ...form, projectId });
    alert(isEditMode ? 'Task Updated!' : 'Task Created!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header title={isEditMode ? "Edit Task" : "Create Task"} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        <TextInputField
          label="Task Name"
          value={form.taskName}
          onChangeText={(text) => handleChange('taskName', text)}
          placeholder="e.g., Design UI mockups"
        />
        <TextAreaField
          label="Description"
          value={form.taskDescription}
          onChangeText={(text) => handleChange('taskDescription', text)}
          placeholder="Provide task details..."
        />
        <SelectField
          label="Assigned To"
          value={form.assignedTo}
          onValueChange={(value) => handleChange('assignedTo', value)}
          options={projectMembersOptions}
          placeholder="Select a member"
        />
        <DatePickerField
          label="Due Date"
          value={form.taskDueDate}
          onDateChange={(date) => handleChange('taskDueDate', date)}
        />
        <SelectField
          label="Status"
          value={form.taskStatus}
          onValueChange={(value) => handleChange('taskStatus', value)}
          options={statusOptions}
        />
        <SelectField
          label="Priority"
          value={form.taskPriority}
          onValueChange={(value) => handleChange('taskPriority', value)}
          options={priorityOptions}
        />
        <CustomButton label="Save Task" onPress={handleSubmit} style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Authentication Screens
export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
    // Integrate with AuthContext/API here
    // On success, navigate to MainTabs
    // For demo: Assume success and replace this with actual login logic
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={screenStyles.authContainer}>
      <ScrollView contentContainerStyle={screenStyles.scrollViewContentCentered}>
        <Text style={screenStyles.authTitle}>Welcome Back</Text>
        <TextInputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          inputType="email"
        />
        <TextInputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
        <CustomButton label="Login" onPress={handleLogin} style={screenStyles.authButton} />
        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={screenStyles.authLink}>
          <Text style={screenStyles.authLinkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Signup attempt:', { name, email, password });
    // Integrate with AuthContext/API here
    // On success, navigate to MainTabs or Login
    // For demo: Assume success and replace this with actual signup logic
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={screenStyles.authContainer}>
      <ScrollView contentContainerStyle={screenStyles.scrollViewContentCentered}>
        <Text style={screenStyles.authTitle}>Create Account</Text>
        <TextInputField
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />
        <TextInputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          inputType="email"
        />
        <TextInputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
        />
        <TextInputField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />
        <CustomButton label="Sign Up" onPress={handleSignup} style={screenStyles.authButton} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={screenStyles.authLink}>
          <Text style={screenStyles.authLinkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---

const basePadding = 15;
const borderRadius = 8;

const sharedStyles = StyleSheet.create({
  // General
  sectionContainer: {
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: borderRadius,
    padding: basePadding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  detailSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailSectionWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
    textAlign: 'right',
  },
  // Header
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: basePadding,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 5,
  },
  backButton: {
    position: 'absolute',
    left: basePadding,
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius,
    padding: basePadding,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryCardTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  // Button
  button: {
    backgroundColor: '#3F51B5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: borderRadius,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  clearSearchIcon: {
    marginLeft: 8,
  },
  // List
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: basePadding,
    borderRadius: borderRadius,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 10,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listItemSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  // Forms
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadius,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textAreaField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadius,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadius,
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 50,
    position: 'relative',
  },
  pickerStyle: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  pickerItemStyle: {
    fontSize: 16,
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
  },
  multiSelectTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadius,
    padding: 12,
    minHeight: 50,
    backgroundColor: '#fff',
  },
  multiSelectValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  multiSelectOptionsContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadius,
    backgroundColor: '#fff',
    marginTop: 5,
    maxHeight: 200,
    overflow: 'hidden',
  },
  multiSelectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  multiSelectOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadius,
    padding: 12,
    minHeight: 50,
    backgroundColor: '#fff',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  // Status Badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Avatar List
  avatarListContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  avatarItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  avatarName: {
    fontSize: 12,
    marginTop: 5,
    color: '#555',
  },
});

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollViewContent: {
    padding: basePadding,
    paddingBottom: 30,
  },
  scrollViewContentCentered: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: basePadding * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Auth Screens
  authContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: '#4CAF50',
    marginTop: 20,
    width: '100%',
    paddingVertical: 15,
  },
  authLink: {
    marginTop: 20,
  },
  authLinkText: {
    color: '#3F51B5',
    fontSize: 16,
  },
});

const dashboardStyles = StyleSheet.create({
  summaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: borderRadius,
    padding: basePadding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
});

const teamDetailsStyles = StyleSheet.create({
  detailSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});

const memberDetailsStyles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  detailSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});

// Dummy Picker for web compatibility / if not using react-native-picker/picker
// In a real project, use `import { Picker } from '@react-native-picker/picker';`
const Picker = ({ selectedValue, onValueChange, children, style, itemStyle }) => (
  <select value={selectedValue} onChange={e => onValueChange(e.target.value)} style={{...style, borderWidth: 0, outline: 'none', appearance: 'none', backgroundColor: 'transparent'}}>
    {React.Children.map(children, child => {
      if (child.type === 'option' || child.type === Picker.Item) {
        return <option value={child.props.value} disabled={child.props.enabled === false}>{child.props.label}</option>;
      }
      return child;
    })}
  </select>
);
Picker.Item = ({ label, value, color }) => (<option value={value} style={{color: color}}>{label}</option>);