import Link from 'next/link';
import { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { Banner } from '@tih/ui';

import { useGoogleAnalytics } from '~/components/global/GoogleAnalytics';
import OffersTable from '~/components/offers/table/OffersTable';
import CompaniesTypeahead from '~/components/shared/CompaniesTypeahead';
import Container from '~/components/shared/Container';
import CountriesTypeahead from '~/components/shared/CountriesTypeahead';
import type { JobTitleType } from '~/components/shared/JobTitles';
import { JobTitleLabels } from '~/components/shared/JobTitles';
import JobTitlesTypeahead from '~/components/shared/JobTitlesTypahead';

import { useSearchParamSingle } from '~/utils/offers/useSearchParam';

export default function OffersHomePage() {
  const [countryFilter, setCountryFilter] = useState('');
  const { event: gaEvent } = useGoogleAnalytics();

  const [selectedCompanyName, setSelectedCompanyName] =
    useSearchParamSingle('companyName');
  const [selectedCompanyId, setSelectedCompanyId] =
    useSearchParamSingle('companyId');

  const [selectedJobTitleId, setSelectedJobTitleId] =
    useSearchParamSingle<JobTitleType | null>('jobTitleId');

  return (
    <main className="flex-1 overflow-y-auto">
      <Banner size="sm">
        ⭐ Check if your offer is competitive by submitting it{' '}
        <Link className="underline" href="/offers/submit">
          here
        </Link>
        . ⭐
      </Banner>
      <div className="text-primary-600 flex items-center justify-end space-x-1 bg-slate-100 px-4 pt-4 sm:text-lg">
        <span>
          <MapPinIcon className="flex h-7 w-7" />
        </span>
        <CountriesTypeahead
          isLabelHidden={true}
          placeholder="All Countries"
          onSelect={(option) => {
            if (option) {
              setCountryFilter(option.value);
              gaEvent({
                action: `offers.table_filter_country_${option.value}`,
                category: 'engagement',
                label: 'Filter by country',
              });
            } else {
              setCountryFilter('');
            }
          }}
        />
      </div>
      <div className="bg-slate-100 py-16 px-4">
        <div>
          <div>
            <h1 className="text-primary-600 text-center text-4xl font-bold sm:text-5xl">
              Tech Offers Repo
            </h1>
          </div>
          <div className="mt-4 text-center text-lg text-slate-600 sm:text-2xl">
            Find out how good your offer is. Discover how others got their
            offers.
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-sm text-slate-700 sm:mt-10 sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-lg">
          <span>Viewing offers for</span>
          <div className="flex items-center space-x-4">
            <JobTitlesTypeahead
              isLabelHidden={true}
              placeholder="All Job Titles"
              textSize="inherit"
              value={
                selectedJobTitleId
                  ? {
                      id: selectedJobTitleId,
                      label: JobTitleLabels[selectedJobTitleId as JobTitleType],
                      value: selectedJobTitleId,
                    }
                  : null
              }
              onSelect={(option) => {
                if (option) {
                  setSelectedJobTitleId(option.id as JobTitleType);
                  gaEvent({
                    action: `offers.table_filter_job_title_${option.value}`,
                    category: 'engagement',
                    label: 'Filter by job title',
                  });
                } else {
                  setSelectedJobTitleId(null);
                }
              }}
            />
            <span>in</span>
            <CompaniesTypeahead
              isLabelHidden={true}
              placeholder="All Companies"
              textSize="inherit"
              value={
                selectedCompanyName
                  ? {
                      id: selectedCompanyId,
                      label: selectedCompanyName,
                      value: selectedCompanyId,
                    }
                  : null
              }
              onSelect={(option) => {
                if (option) {
                  setSelectedCompanyId(option.id);
                  setSelectedCompanyName(option.label);
                  gaEvent({
                    action: `offers.table_filter_company_${option.value}`,
                    category: 'engagement',
                    label: 'Filter by company',
                  });
                } else {
                  setSelectedCompanyId('');
                  setSelectedCompanyName('');
                }
              }}
            />
          </div>
        </div>
      </div>
      <Container className="pb-20 pt-10">
        <OffersTable
          companyFilter={selectedCompanyId}
          companyName={selectedCompanyName}
          countryFilter={countryFilter}
          jobTitleFilter={selectedJobTitleId ?? ''}
        />
      </Container>
    </main>
  );
}
