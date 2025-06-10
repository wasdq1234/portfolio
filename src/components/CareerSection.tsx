import { CareerWithProjects } from '@/types/database';

interface CareerSectionProps {
  careers: CareerWithProjects[];
}

export default function CareerSection({ careers }: CareerSectionProps) {
  const formatDate = (date: string | null) => {
    if (!date) return '현재';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          경력사항
        </h2>
      </div>
      
      {careers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
          <p className="text-gray-500">등록된 경력이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {careers.map((career) => (
            <div key={career.id} className="relative">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                {/* 타임라인 도트 */}
                <div className="absolute -left-4 top-6 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {career.company_name}
                    </h3>
                    {career.position && (
                      <p className="text-blue-600 font-semibold">{career.position}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 lg:mt-0">
                    <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-lg">
                      {formatDate(career.start_date)} - {formatDate(career.end_date)}
                    </span>
                  </div>
                </div>
                
                {career.job_description && (
                  <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                    {career.job_description}
                  </p>
                )}
              
                {career.projects && career.projects.length > 0 && (
                  <div className="mt-4">
                    <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                      <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      주요 프로젝트
                    </h4>
                    <div className="grid gap-3">
                      {career.projects.map((project) => (
                        <div key={project.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                          <h5 className="font-semibold text-gray-900 mb-2">{project.project_name}</h5>
                          {project.description && (
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed whitespace-pre-line">{project.description}</p>
                          )}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, techIndex) => (
                                <span 
                                  key={techIndex}
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
} 