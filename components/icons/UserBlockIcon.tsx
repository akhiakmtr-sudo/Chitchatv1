import React from 'react';

const UserBlockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <path d="M16 16v-2a4 4 0 0 0-4-4H8" />
    <circle cx="8" cy="9" r="2" />
  </svg>
);

export default UserBlockIcon;
