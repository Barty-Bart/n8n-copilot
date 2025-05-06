import { useEffect, useState } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  const [statusIndicator, setStatusIndicator] = useState<'active' | 'inactive'>('inactive');
  const [statusText, setStatusText] = useState('Checking status...');
  const [showSettings, setShowSettings] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'openai' | 'anthropic'>('openai');
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [n8nApiUrl, setN8nApiUrl] = useState('');
  const [n8nApiKey, setN8nApiKey] = useState('');
  const [saveButtonText, setSaveButtonText] = useState('Save Settings');

  // Centralized n8n page detection
  const isN8nPage = (url: string) => {
    return url.includes('n8n') || 
           url.includes('workflow') || 
           url.includes('execution') ||
           url.includes('localhost');
  };

  useEffect(() => {
    // Simulate checking if current tab is an n8n page
    // In a real extension, this would use chrome.tabs API
    const url = window.location.href;
    const isN8nDetected = isN8nPage(url);
    
    // Update UI based on detection
    if (isN8nDetected) {
      setStatusIndicator('active');
      setStatusText('On an n8n page');
    } else {
      setStatusIndicator('inactive');
      setStatusText('Not an n8n page');
    }

    // Load saved settings
    // In a real extension, this would use chrome.storage.sync.get
    const savedSettings = localStorage.getItem('n8nCopilotSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.openaiKey) setOpenaiKey(settings.openaiKey);
      if (settings.anthropicKey) setAnthropicKey(settings.anthropicKey);
      if (settings.n8nApiUrl) setN8nApiUrl(settings.n8nApiUrl);
      if (settings.n8nApiKey) setN8nApiKey(settings.n8nApiKey);
      if (settings.activeProvider) setActiveProvider(settings.activeProvider);
    }
  }, []);

  // Handle provider toggle selection
  const handleProviderToggle = (provider: 'openai' | 'anthropic') => {
    setActiveProvider(provider);
  };

  // Validate n8n API URL
  const validateN8nApiUrl = (url: string) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  // Test n8n API connection
  const testN8nApiConnection = async (url: string, apiKey: string) => {
    try {
      const response = await fetch(`${url}/api/v1/me`, {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': apiKey
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('n8n API connection test failed:', error);
      return false;
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    // Validate n8n API URL if provided
    let n8nApiValid = true;
    if (n8nApiUrl && n8nApiKey) {
      if (!validateN8nApiUrl(n8nApiUrl)) {
        alert('Please enter a valid n8n API URL (e.g., https://your-n8n-instance.com)');
        n8nApiValid = false;
      }
    }
    
    if (!n8nApiValid) return;
    
    // Save settings
    const settings = {
      openaiKey,
      anthropicKey,
      activeProvider,
      n8nApiUrl,
      n8nApiKey
    };
    
    // In a real extension, this would use chrome.storage.sync.set
    localStorage.setItem('n8nCopilotSettings', JSON.stringify(settings));
    
    // Show save confirmation
    setSaveButtonText('Saved!');
    
    // Test n8n API connection if provided
    if (n8nApiUrl && n8nApiKey) {
      const isConnected = await testN8nApiConnection(n8nApiUrl, n8nApiKey);
      if (isConnected) {
        setStatusText(prev => prev + ' (n8n API connected)');
      }
    }
    
    setTimeout(() => {
      setSaveButtonText('Save Settings');
    }, 2000);
  };

  // Show chat handler
  const handleShowChat = () => {
    // In a real extension, this would send a message to the content script
    console.log('Show chat button clicked');
    // Simulate closing the popup
    alert('Chat would open in the main window');
  };

  return (
    <div className="container">
      <div className="ai-shimmer"></div>
      <h1>n8n Co Pilot</h1>
      <p>AI-powered assistant for building n8n workflows efficiently.</p>
      
      <div className="status-container">
        <div className={`status-indicator ${statusIndicator}`}></div>
        <span id="status-text">{statusText}</span>
      </div>
      
      <div className="buttons">
        <button 
          id="show-chat" 
          onClick={handleShowChat}
          disabled={statusIndicator === 'inactive'}
        >
          Show AI Assistant
        </button>
        <button 
          id="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>
      </div>
      
      <div className={`settings-panel ${showSettings ? '' : 'hidden'}`}>
        <h2>AI Provider</h2>
        
        <div className="toggle-container" data-selected={activeProvider}>
          <div className="toggle-slider"></div>
          <div 
            className="toggle-option" 
            data-value="openai"
            onClick={() => handleProviderToggle('openai')}
          >
            OpenAI
          </div>
          <div 
            className="toggle-option" 
            data-value="anthropic"
            onClick={() => handleProviderToggle('anthropic')}
          >
            Anthropic
          </div>
        </div>
        
        <div className={`api-section ${activeProvider !== 'openai' ? 'hidden' : ''}`}>
          <div className="model-badge active">GPT-4.1</div>
          <div className="setting">
            <label htmlFor="openai-key">OpenAI API Key:</label>
            <input 
              type="password" 
              id="openai-key" 
              placeholder="sk-..." 
              autoComplete="off"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
          </div>
        </div>
        
        <div className={`api-section ${activeProvider !== 'anthropic' ? 'hidden' : ''}`}>
          <div className="model-badge active">Claude 3.7</div>
          <div className="setting">
            <label htmlFor="anthropic-key">Anthropic API Key:</label>
            <input 
              type="password" 
              id="anthropic-key" 
              placeholder="sk-ant-..." 
              autoComplete="off"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
            />
          </div>
        </div>
        
        <h2>n8n Integration</h2>
        <div className="api-section">
          <div className="setting">
            <label htmlFor="n8n-api-url">n8n API URL:</label>
            <input 
              type="text" 
              id="n8n-api-url" 
              placeholder="https://your-n8n-instance.com" 
              autoComplete="off"
              value={n8nApiUrl}
              onChange={(e) => setN8nApiUrl(e.target.value)}
            />
          </div>
          <div className="setting">
            <label htmlFor="n8n-api-key">n8n API Key:</label>
            <input 
              type="password" 
              id="n8n-api-key" 
              placeholder="n8n_api_..." 
              autoComplete="off"
              value={n8nApiKey}
              onChange={(e) => setN8nApiKey(e.target.value)}
            />
          </div>
          <div className="helper-text">
            <small>Required to apply workflow components directly to your canvas</small>
          </div>
        </div>
        
        <button 
          id="save-settings"
          onClick={handleSaveSettings}
        >
          {saveButtonText}
        </button>
      </div>
      
      <div className="footer">
        <p>v1.0.0 • Powered by AI</p>
      </div>
    </div>
  );
};

export default Settings;
