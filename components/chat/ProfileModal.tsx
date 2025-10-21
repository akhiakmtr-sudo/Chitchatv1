import React, { useState, useCallback } from 'react';
import { User } from '../../types';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => Promise<void>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>(user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) {
        newErrors.username = 'Name cannot be empty.';
    }
    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || ageNum < 18) {
        newErrors.age = 'You must be 18 or older.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
    if (touched[name]) {
        validate();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validate();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, age: true });
    if (!validate()) return;

    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Profile</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-4">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <img src={avatarPreview || formData.avatar} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
              <div>
                <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Change Photo
                </label>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <div className="relative">
                <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Name</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur} className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 ${touched.username && errors.username ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500'}`} />
                 {touched.username && errors.username && <p className="text-red-500 text-xs mt-1 absolute">{errors.username}</p>}
              </div>
              <div className="relative">
                <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Age</label>
                <input type="number" name="age" value={formData.age || ''} onChange={handleChange} onBlur={handleBlur} className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 ${touched.age && errors.age ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500'}`} />
                 {touched.age && errors.age && <p className="text-red-500 text-xs mt-1 absolute">{errors.age}</p>}
              </div>
               <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Location</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
               <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Gender</label>
                <select name="gender" value={formData.gender || 'Prefer not to say'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                </select>
              </div>
              <div className="md:col-span-2">
                 <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Bio</label>
                 <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3} placeholder="Tell us about yourself..." className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 dark:bg-gray-900/50 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl mt-auto">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition-colors">Cancel</button>
            <button 
                type="submit" 
                disabled={isSaving}
                className="w-36 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isSaving ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    'Save Changes'
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
