import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Client {
  clientID: string;
  clientName: string;
  isActive: boolean;
  googleReviewUrl: string;
  notificationEmail: string;
  logoUrl: string;
  createdAt: string;
}

interface CustomPageTextConfig {
  welcomeMessage?: string;
  positiveFeedbackPrompt?: string;
  negativeFeedbackPrompt?: string;
  thankYouMessageTitle?: string;
  thankYouMessageBody?: string;
  submitButtonText?: string;
}

interface ThemeColorsConfig {
  primary?: string;
  secondary?: string;
  pageBackground?: string;
  textColor?: string;
  buttonTextColor?: string;
}

interface FontPreferencesConfig {
  primaryFont?: string;
  secondaryFont?: string;
}

interface NewClientData {
  clientName: string;
  googleReviewUrl: string;
  notificationEmail: string;
  isActive: boolean;
  logoFile?: File | null;
  customPageText: CustomPageTextConfig;
  themeColors: ThemeColorsConfig;
  fontPreferences: FontPreferencesConfig;
}

const initialNewClientData: NewClientData = {
  clientName: '',
  googleReviewUrl: '',
  notificationEmail: '',
  isActive: true,
  logoFile: null,
  customPageText: {
    welcomeMessage: '',
    positiveFeedbackPrompt: '',
    negativeFeedbackPrompt: '',
    thankYouMessageTitle: '',
    thankYouMessageBody: '',
    submitButtonText: '',
  },
  themeColors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    pageBackground: '#FFFFFF',
    textColor: '#333333',
    buttonTextColor: '#FFFFFF',
  },
  fontPreferences: {
    primaryFont: 'Arial, sans-serif',
    secondaryFont: 'Helvetica, sans-serif',
  },
};

const ClientAdminPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all'); // 'all', 'active', 'inactive'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClient, setNewClient] = useState<NewClientData>(initialNewClientData);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterActive !== 'all') params.append('isActive', filterActive === 'active' ? 'true' : 'false');
        
        const response = await fetch(`https://bw4agz6xn4.execute-api.ap-southeast-2.amazonaws.com/prod/admin/clients?${params.toString()}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch clients and parse error JSON' }));
          throw new Error(errorData.message || 'Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data.clients || []); // Ensure clients is always an array
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching clients');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [searchTerm, filterActive]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setNewClient(prev => ({ ...prev, [name]: checked }));
    } else {
        setNewClient(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedInputChange = (section: keyof NewClientData, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewClient(prev => ({ ...prev, logoFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('clientData', JSON.stringify({
        clientName: newClient.clientName,
        googleReviewUrl: newClient.googleReviewUrl,
        notificationEmail: newClient.notificationEmail,
        isActive: newClient.isActive,
        customPageText: newClient.customPageText,
        themeColors: newClient.themeColors,
        fontPreferences: newClient.fontPreferences,
      }));
      if (newClient.logoFile) {
        formData.append('logoFile', newClient.logoFile);
      }

      const response = await fetch('https://bw4agz6xn4.execute-api.ap-southeast-2.amazonaws.com/prod/admin/clients', {
        method: 'POST',
        body: formData, 
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create client and parse error JSON' }));
        throw new Error(errorData.message || 'Failed to create client');
      }
      const createdClient = await response.json();
      setClients(prev => [...prev, createdClient.clientData]); 
      setShowCreateForm(false);
      setNewClient(initialNewClientData);
      // Optionally re-fetch clients list by updating a trigger state for useEffect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during client creation');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActiveFilter = filterActive === 'all' || (filterActive === 'active' && client.isActive) || (filterActive === 'inactive' && !client.isActive);
    return matchesSearch && matchesActiveFilter;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Administration</h1>

      {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}

      {!showCreateForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="border rounded p-2"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>Create New Client</Button>
          </div>

          {isLoading && <p>Loading clients...</p>}
          {!isLoading && !error && filteredClients.length === 0 && <p>No clients found.</p>}
          {!isLoading && !error && filteredClients.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <Card key={client.clientID}>
                  <CardHeader>
                    <CardTitle>{client.clientName}</CardTitle>
                    <CardDescription>ID: {client.clientID}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Status: {client.isActive ? 'Active' : 'Inactive'}</p>
                    <p>Email: {client.notificationEmail}</p>
                    <p>Google Review: <a href={client.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a></p>
                  </CardContent>
                  <CardFooter>
                    {/* <Button variant="outline" size="sm">Edit</Button> */}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create New Client</CardTitle>
            <CardDescription>Fill in the details for the new client.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="text">Page Text</TabsTrigger>
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" name="clientName" value={newClient.clientName} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="googleReviewUrl">Google Review URL</Label>
                    <Input id="googleReviewUrl" name="googleReviewUrl" type="url" value={newClient.googleReviewUrl} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="notificationEmail">Notification Email</Label>
                    <Input id="notificationEmail" name="notificationEmail" type="email" value={newClient.notificationEmail} onChange={handleInputChange} required />
                  </div>
                   <div className="flex items-center space-x-2">
                    <Checkbox id="isActive" name="isActive" checked={newClient.isActive} onCheckedChange={(checked) => setNewClient(prev => ({ ...prev, isActive: Boolean(checked) }))} />
                    <Label htmlFor="isActive">Client is Active</Label>
                  </div>
                  <div>
                    <Label htmlFor="logoFile">Logo File</Label>
                    <Input id="logoFile" name="logoFile" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml" />
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea id="welcomeMessage" name="welcomeMessage" value={newClient.customPageText.welcomeMessage} onChange={(e) => handleNestedInputChange('customPageText', e)} />
                  </div>
                  <div>
                    <Label htmlFor="positiveFeedbackPrompt">Positive Feedback Prompt</Label>
                    <Textarea id="positiveFeedbackPrompt" name="positiveFeedbackPrompt" value={newClient.customPageText.positiveFeedbackPrompt} onChange={(e) => handleNestedInputChange('customPageText', e)} />
                  </div>
                  <div>
                    <Label htmlFor="negativeFeedbackPrompt">Negative Feedback Prompt</Label>
                    <Textarea id="negativeFeedbackPrompt" name="negativeFeedbackPrompt" value={newClient.customPageText.negativeFeedbackPrompt} onChange={(e) => handleNestedInputChange('customPageText', e)} />
                  </div>
                  <div>
                    <Label htmlFor="thankYouMessageTitle">Thank You Message Title</Label>
                    <Input id="thankYouMessageTitle" name="thankYouMessageTitle" value={newClient.customPageText.thankYouMessageTitle} onChange={(e) => handleNestedInputChange('customPageText', e)} />
                  </div>
                  <div>
                    <Label htmlFor="thankYouMessageBody">Thank You Message Body</Label>
                    <Textarea id="thankYouMessageBody" name="thankYouMessageBody" value={newClient.customPageText.thankYouMessageBody} onChange={(e) => handleNestedInputChange('customPageText', e)} />
                  </div>
                   <div>
                    <Label htmlFor="submitButtonText">Submit Button Text (Negative Feedback)</Label>
                    <Input id="submitButtonText" name="submitButtonText" value={newClient.customPageText.submitButtonText} onChange={(e) => handleNestedInputChange('customPageText', e)} />
                  </div>
                </TabsContent>

                <TabsContent value="theme" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="primary">Primary Color (hex)</Label>
                    <Input id="primary" name="primary" value={newClient.themeColors.primary} onChange={(e) => handleNestedInputChange('themeColors', e)} />
                  </div>
                  <div>
                    <Label htmlFor="secondary">Secondary Color (hex)</Label>
                    <Input id="secondary" name="secondary" value={newClient.themeColors.secondary} onChange={(e) => handleNestedInputChange('themeColors', e)} />
                  </div>
                  <div>
                    <Label htmlFor="pageBackground">Page Background Color (hex)</Label>
                    <Input id="pageBackground" name="pageBackground" value={newClient.themeColors.pageBackground} onChange={(e) => handleNestedInputChange('themeColors', e)} />
                  </div>
                  <div>
                    <Label htmlFor="textColor">Text Color (hex)</Label>
                    <Input id="textColor" name="textColor" value={newClient.themeColors.textColor} onChange={(e) => handleNestedInputChange('themeColors', e)} />
                  </div>
                  <div>
                    <Label htmlFor="buttonTextColor">Button Text Color (hex)</Label>
                    <Input id="buttonTextColor" name="buttonTextColor" value={newClient.themeColors.buttonTextColor} onChange={(e) => handleNestedInputChange('themeColors', e)} />
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="primaryFont">Primary Font Family</Label>
                    <Input id="primaryFont" name="primaryFont" value={newClient.fontPreferences.primaryFont} onChange={(e) => handleNestedInputChange('fontPreferences', e)} placeholder="e.g., Arial, sans-serif" />
                  </div>
                  <div>
                    <Label htmlFor="secondaryFont">Secondary Font Family</Label>
                    <Input id="secondaryFont" name="secondaryFont" value={newClient.fontPreferences.secondaryFont} onChange={(e) => handleNestedInputChange('fontPreferences', e)} placeholder="e.g., Helvetica, sans-serif" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => { setShowCreateForm(false); setNewClient(initialNewClientData); }}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Client'}</Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ClientAdminPage;

