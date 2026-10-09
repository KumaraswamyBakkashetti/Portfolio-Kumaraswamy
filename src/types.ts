export interface Project {
  id: string;
  name: string;
  tagline: string;
  techStack: string[];
  bullets: string[];
  problem: string;
  solution: string;
  architecture: string[];
  impact: string;
  links: {
    github?: string;
    demo?: string;
    paper?: string;
  };
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Achievement {
  title: string;
  description: string;
  tag: string;
}

export interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl: string;
  tagline: string;
  location: string;
  period: string;
  status: string;
  type: string;
  overview: string;
  techStack: string[];
}
