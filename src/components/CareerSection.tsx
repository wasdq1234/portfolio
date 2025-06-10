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
    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">경력사항</h2>
      
      {careers.length === 0 ? (
        <p className="text-gray-500">등록된 경력이 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {careers.map((career) => (
            <div key={career.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {career.company_name}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDate(career.start_date)} - {formatDate(career.end_date)}
                </span>
              </div>
              
              {career.position && (
                <p className="text-gray-700 font-medium mb-2">{career.position}</p>
              )}
              
              {career.job_description && (
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {career.job_description}
                </p>
              )}
              
              {career.projects && career.projects.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-gray-800 mb-2">주요 프로젝트</h4>
                  <div className="grid gap-2">
                    {career.projects.map((project) => (
                      <div key={project.id} className="bg-gray-50 p-3 rounded">
                        <h5 className="font-medium text-gray-800">{project.project_name}</h5>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, index) => (
                              <span 
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
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
          ))}
        </div>
      )}
    </section>
  );
} 